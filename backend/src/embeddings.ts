import { Embedding, getDatabase } from "./db/index";
import { memoize } from 'lodash'
import { MaybePromise, retry } from "./utils/promise";
import { globalAI } from "./ai";
import { FindOptions, InferAttributes, InferCreationAttributes, Op, Sequelize } from "sequelize";

export const getEmbedding = memoize(async function (
  text: string,
  onCreateStore?: () => MaybePromise<Omit<InferCreationAttributes<Embedding>, 'text' | 'vec' | 'id' | 'createdAt' | 'updatedAt'>>
) {
  await getDatabase();

  let existing = await Embedding.findOne({
    where: { text }
  })

  if (!existing) {
    const vec = await retry(() => globalAI.embedding.compute(text))
    const extra = onCreateStore && await onCreateStore()

    existing = await Embedding.create({
      text,
      vec,
      type: 'unknown',
      ...extra
    })
  } else if (existing.type === 'unknown' && onCreateStore) {
    const extra = onCreateStore && await onCreateStore()
    existing = await existing.update({ ...extra })
  }

  return existing
})

export const findEmbeddings = async function (
  text: string,
  opts: { limit: number } & Omit<FindOptions<InferAttributes<Embedding>>, 'order'>
) {
  const rec = await getEmbedding(text);
  const vec = rec.vec;

  const embeddings = await Embedding.findAll({
    ...opts,
    where: {
      [Op.and]: [
        { id: { [Op.ne]: rec.id } },
        { type: { [Op.ne]: 'unknown' } },
        opts.where || {}
      ],
    },

    // https://github.com/pgvector/pgvector#vector-operators
    // https://juejin.cn/post/7086276704770981902
    attributes: {
      include: [
        [Sequelize.literal(`1 - (vec <-> '[${vec.join(', ')}]')`), 'similarity'],
      ]
    },
    order: [['similarity', 'DESC']],
  })

  return { vec, embeddings }
}

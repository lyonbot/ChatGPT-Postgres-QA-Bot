import pgvector from 'pgvector/sequelize';
import { DataTypes, Model, Sequelize } from "sequelize";
import type { CreationOptional, NonAttribute, InferAttributes, InferCreationAttributes } from 'sequelize'

import { globalAI } from '../ai';

// see https://sequelize.org/docs/v6/other-topics/typescript/

pgvector.registerType(Sequelize);
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.POSTGRES_HOST || '127.0.0.1',
  port: +process.env.POSTGRES_PORT! || 5432,
  database: process.env.POSTGRES_DB!,
  username: process.env.POSTGRES_USER!,
  password: process.env.POSTGRES_PASSWORD!,
  logging: false
})

export class Embedding extends Model<
  InferAttributes<Embedding, { omit: never }>,
  InferCreationAttributes<Embedding, { omit: never }>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare text: string;
  declare vec: number[];

  declare type: 'unknown' | 'knowledge';

  /** only exists in `findEmbeddings` */
  declare similarity?: number;
}

const init = (async function () {
  Embedding.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,

    text: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    },
    vec: {
      type: DataTypes.VECTOR(globalAI.embedding.dimension)
    },
    type: {
      type: DataTypes.ENUM('unknown', 'knowledge'),
      defaultValue: 'unknown'
    },

    similarity: DataTypes.VIRTUAL,
  }, {
    sequelize,
    timestamps: true,
    name: { singular: 'Embedding', plural: 'Embeddings' },
  })

  await sequelize.authenticate()
  await sequelize.query('CREATE EXTENSION IF NOT EXISTS vector');
  await sequelize.sync({
    force: false,
    alter: { drop: false },
  });

  return sequelize as Omit<Sequelize, 'models'> & {
    models: {
      Embedding: typeof Embedding
    }
  }
})();

export const getDatabase = () => init

export const shutdownDatabase = async () => {
  await sequelize.close()
}

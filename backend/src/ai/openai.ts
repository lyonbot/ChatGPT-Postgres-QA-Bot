import { OpenAIApi, Configuration } from 'openai'
import Axios, { AxiosInstance } from 'axios'
import httpsProxyAgent from 'https-proxy-agent';
import { AIEmbeddingModel } from './base';

var requestor: AxiosInstance
const proxyConfig = process.env.http_proxy || process.env.HTTP_PROXY
if (proxyConfig) {
  let agent = httpsProxyAgent(proxyConfig);
  requestor = Axios.create({
    proxy: false,
    httpAgent: agent,
    httpsAgent: agent
  })
} else {
  requestor = Axios.create()
}

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) throw new Error('Need OPENAI_API_KEY')

const config = new Configuration({
  apiKey,
})

const OpenAI = new OpenAIApi(config, undefined, requestor as any)

export const OpenAIEmbeddingModel: AIEmbeddingModel = {
  dimension: 1536,
  compute: async (text: string) => {
    const { data } = await OpenAI.createEmbedding({
      input: text,
      model: "text-embedding-ada-002"
    })

    return data.data[0].embedding
  }
}

export async function answerQuestion(opt: { contexts: string[], question: string }) {
  const { contexts, question } = opt
  const { data } = await OpenAI.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        "role": "system",
        "content": "You are a helpful manual book. Given the following knowledge as information source, answer any questions the user asks. Answer as truthfully as possible, and if the answer is not contained within the text below, say \"I don't know\". Write the answer in the same language of the question. At the end of your answer, list all related source links like [[KNOWLEDGE 1]], [[KNOWLEDGE 2]]."
      },
      {
        "role": "user",
        "content": [
          ...contexts.map((context, index) => `KNOWLEDGE ${index + 1}:\n${context}`),
          'QUESTION:\n' + question
        ].join('\n\n')
      },
    ]
  })

  return data.choices[0].message?.content
}

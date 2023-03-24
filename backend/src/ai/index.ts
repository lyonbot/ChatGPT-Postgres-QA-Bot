import { AIModelHub } from "./base";
import { OpenAIEmbeddingModel } from "./openai";

export const globalAI: AIModelHub = {
  embedding: OpenAIEmbeddingModel,
}

export interface AIModelHub {
  embedding: AIEmbeddingModel
}

export interface AIEmbeddingModel {
  dimension: number;
  compute(text: string): Promise<number[]>
}

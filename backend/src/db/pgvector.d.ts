
declare module 'pgvector/sequelize' {
  import type { Sequelize } from 'sequelize';
  import 'sequelize/types/data-types';

  // https://github.com/pgvector/pgvector-node#sequelize

  declare module 'sequelize/types/data-types' {
    export const VECTOR: VectorDataTypeConstructor;

    interface VectorDataTypeConstructor extends AbstractDataTypeConstructor {
      new(dimensions: number): VectorDataType;
      (dimensions: number): VectorDataType;
    }

    export interface VectorDataType extends AbstractDataType {
      _dimensions: number;
      validate(value: unknown): boolean;
    }
  }

  export function registerType(sequelize: typeof Sequelize): void;
}
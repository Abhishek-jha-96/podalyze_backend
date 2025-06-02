import { TransformFnParams } from 'class-transformer';

export const lowerCaseTransformer = (params: TransformFnParams) =>
  params.value?.toLowerCase().trim();

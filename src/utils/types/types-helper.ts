// Types Start here.
export type NullableType<T> = T | null;

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

// Interfaces start here.
export interface IPaginationOptions {
  page: number;
  limit: number;
}

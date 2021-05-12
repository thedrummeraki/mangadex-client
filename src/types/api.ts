export function defaultPagedResults<T>() {
  return {
    results: [] as Array<T>,
    limit: 0,
    offset: 0,
    total: 0,
  };
}

export interface PagedResultsList<T> {
  results: Array<GenericResponse<T>>;
  limit: number;
  offset: number;
  total: number;
}

export interface GenericResponse<T> {
  result: "ok" | "ko";
  data: T;
  relationships: Array<Relationship>;
}

export interface Relationship {
  id: string;
  type: string;
}

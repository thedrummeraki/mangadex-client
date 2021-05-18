export function defaultPagedResults<T>() {
  return {
    results: [] as Array<T>,
    limit: 0,
    offset: 0,
    total: 0,
  };
}

interface MangaDexError {
  id: string;
  status: number;
  title: string;
  detail: string;
}

interface SuccessPagedResults<T> {
  results: Array<GenericResponse<T>>;
  limit: number;
  offset: number;
  total: number;
}

interface ErrorPagedResults {
  result: "error";
  errors: Array<MangaDexError>;
}

export type PagedResultsList<T> = SuccessPagedResults<T> & ErrorPagedResults;

export interface GenericResponse<T> {
  result: "ok" | "ko";
  data: T;
  relationships: Array<Relationship>;
}

export interface Relationship {
  id: string;
  type: string;
}

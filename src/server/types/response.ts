export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface CursorPaginationResponse<T> {
  data: T[];
  nextCursor: number | null | undefined;
  previousCursor: number | null | undefined;
  total: number;
}

export interface BaseResponse<T> {
  data: T;
  message: string;
  status: number;
}

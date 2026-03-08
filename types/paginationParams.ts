export type SortDirection = "asc" | "desc" | null;

export type PaginationParams = {
  page: number;
  pageSize: number;
  search: string;
};

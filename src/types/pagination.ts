export type Paginated<T> = {
  page: number;
  limit: number;
  isFirst: boolean;
  isLast: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
  totalPages: number;
  totalCount: number;
  data: T[];
};

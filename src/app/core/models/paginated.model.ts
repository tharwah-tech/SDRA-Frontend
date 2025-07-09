export interface PaginatedModel<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  firstItemIndex: number;
  lastItemIndex: number;
}
export function isPaginatedModel<T>(obj: any): obj is PaginatedModel<T> {
  return (
    typeof obj === 'object' &&
    Array.isArray(obj.items) &&
    typeof obj.pageNumber === 'number' &&
    typeof obj.pageSize === 'number' &&
    typeof obj.totalCount === 'number' &&
    typeof obj.totalPages === 'number' &&
    typeof obj.hasPreviousPage === 'boolean' &&
    typeof obj.hasNextPage === 'boolean' &&
    typeof obj.firstItemIndex === 'number' &&
    typeof obj.lastItemIndex === 'number'
  );
}

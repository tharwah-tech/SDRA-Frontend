export interface PaginatedModel<T> {
  total_count: number;
  pages_count: number;
  current_page: number;
  current_page_size: number;
  results: T[];
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

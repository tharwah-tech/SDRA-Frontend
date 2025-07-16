import { PaginatedEntity } from '../../core/entities/paginated.entity';
import { PaginatedModel } from '../../core/models/paginated.model';

export function mapPaginationModelIntoEntity<M, E>(
  paginatedModel: PaginatedModel<M>,
  mapFunction: (model: M) => E
): PaginatedEntity<E> {
  // Calculate missing properties from available ones
  const hasPreviousPage = paginatedModel.current_page > 1;
  const hasNextPage = paginatedModel.current_page < paginatedModel.pages_count;
  const firstItemIndex = (paginatedModel.current_page - 1) * paginatedModel.current_page_size + 1;
  const lastItemIndex = Math.min(
    paginatedModel.current_page * paginatedModel.current_page_size,
    paginatedModel.total_count
  );

  return {
    items: paginatedModel.results.map(mapFunction),
    pageNumber: paginatedModel.current_page,
    pageSize: paginatedModel.current_page_size,
    totalCount: paginatedModel.total_count,
    totalPages: paginatedModel.pages_count,
    hasPreviousPage,
    hasNextPage,
    firstItemIndex,
    lastItemIndex,
  };
}

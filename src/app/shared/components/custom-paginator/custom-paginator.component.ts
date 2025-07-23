import {
  Component,
  input,
  OnChanges,
  output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { PaginationMetadata } from '../../../core/entities/paginator.entity';

@Component({
  selector: 'app-custom-paginator',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './custom-paginator.component.html',
  styleUrl: './custom-paginator.component.scss',
})
export class CustomPaginatorComponent implements OnChanges{
  pagination = input.required<PaginationMetadata>();
  pageSizeOptions = input<number[]>([5, 10, 25, 100]);
  onPageChange = output<number>();
  onPageSizeChange = output<number>();
  disabled = input<boolean>(false);
  pages: number[] = [];
  maxPagesToShow = 7;
  private previousTotalPages: number | undefined;

  ngOnInit() {
    this.generatePageNumbers();
    if (this.pagination()) {
        this.previousTotalPages = this.pagination().totalPages;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    let resetToFirstPage = false;

    if (changes['pagination']) {
      const currentPagination = changes['pagination'].currentValue as PaginationMetadata;
      const previousPagination = changes['pagination'].previousValue as PaginationMetadata;

      if (currentPagination) {
        if (previousPagination && currentPagination.totalPages < previousPagination.totalPages && currentPagination.pageNumber > currentPagination.totalPages) {
          resetToFirstPage = true;
        }
      }
    }

    this.generatePageNumbers();

    if (resetToFirstPage) {
        this.onPageChange.emit(1);
    } else if (this.pagination() && this.pagination().pageNumber > this.pagination().totalPages && this.pagination().totalPages > 0) {
        this.onPageChange.emit(1);
    }

    if (this.pagination()) {
        this.previousTotalPages = this.pagination().totalPages;
    }
  }

  generatePageNumbers(): void {
    if (!this.pagination()) return;
    const totalPages = this.pagination().totalPages;
    const currentPage = this.pagination().pageNumber;

    if (totalPages === 0) {
        this.pages = [];
        return;
    }

    if (totalPages <= this.maxPagesToShow) {
      this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      const leftSibling = Math.max(currentPage - 1, 1);
      const rightSibling = Math.min(currentPage + 1, totalPages);

      const shouldShowLeftDots = leftSibling > 2;
      const shouldShowRightDots = rightSibling < totalPages - 1;

      if (!shouldShowLeftDots && shouldShowRightDots) {
        this.pages = [
          ...Array(this.maxPagesToShow - 2)
            .fill(0)
            .map((_, i) => i + 1),
          -1,
          totalPages,
        ];
      } else if (shouldShowLeftDots && !shouldShowRightDots) {
        this.pages = [
          1,
          -1,
          ...Array(this.maxPagesToShow - 2)
            .fill(0)
            .map((_, i) => totalPages - (this.maxPagesToShow - 2) + i + 1),
        ];
      } else if (shouldShowLeftDots && shouldShowRightDots) {
        if (currentPage - 1 <= 2) {
             this.pages = [
                1, 2, 3, 4, -1, totalPages
             ];
        } else if ( totalPages - currentPage <= 2 ) {
            this.pages = [
                1, -1, totalPages -3, totalPages -2, totalPages -1, totalPages
            ];
        } else {
             this.pages = [
                1,
                -1,
                currentPage - 1,
                currentPage,
                currentPage + 1,
                -2,
                totalPages,
            ];
        }
      } else {
        this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
      }
    }
  }

  changePage(pageNumber: number): void {
    if (
      pageNumber > 0 &&
      pageNumber <= this.pagination().totalPages &&
      !this.disabled() &&
      pageNumber !== this.pagination().pageNumber
    ) {
      this.onPageChange.emit(pageNumber);
    }
  }

  onPrevious(): void {
    if (this.pagination().pageNumber > 1 && !this.disabled()) {
      this.onPageChange.emit(this.pagination().pageNumber - 1);
    }
  }

  onNext(): void {
    if (
      this.pagination().pageNumber < this.pagination().totalPages &&
      !this.disabled()
    ) {
      this.onPageChange.emit(this.pagination().pageNumber + 1);
    }
  }

  onPageSizeChangeFn(event: MatSelectChange) {
    this.onPageSizeChange.emit(event.value);
    this.onPageChange.emit(1);
  }
}

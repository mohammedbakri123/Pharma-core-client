export interface CategoryDto {
  categoryId: number;
  categoryName: string;
  categoryArabicName: string;
}

export interface CategoriesListResponse {
  categories: CategoryDto[];
}

export interface GetCategoriesRequest {
  page?: number;
  limit?: number;
  search?: string;
}

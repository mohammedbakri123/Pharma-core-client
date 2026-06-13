export interface CategoryDto {
  categoryId: number;
  name: string;
  arabicName: string;
}

export interface CategoriesListResponse {
  data: CategoryDto[];
}

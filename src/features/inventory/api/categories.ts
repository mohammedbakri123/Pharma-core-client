import api from "../../../core/api/client";
import type { CategoriesListResponse, GetCategoriesRequest } from "@/types";

const getCategories = (params?: GetCategoriesRequest) =>
  api.get<CategoriesListResponse>("/categories");

export const categoryApi = {
  getCategories,
};

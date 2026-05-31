export interface SupplierDto {
  supplierId: number;
  name: string;
  phoneNumber: string | null;
  address: string | null;
  isDeleted: boolean | null;
  createdAt: string | null;
}

export interface SupplierListResponse {
  suppliers: SupplierDto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface CreateSupplierRequest {
  name: string;
  phoneNumber?: string;
  address?: string;
}

export interface UpdateSupplierRequest {
  name?: string;
  phoneNumber?: string;
  address?: string;
}

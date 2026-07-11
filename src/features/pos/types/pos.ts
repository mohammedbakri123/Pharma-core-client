export interface PosCheckoutItemRequest {
  medicineId: number;
  quantity: number;
}

export interface PosPaymentRequest {
  method: "cash" | "card";
  amount: number;
}

export interface PosCheckoutRequest {
  items: PosCheckoutItemRequest[];
  payments: PosPaymentRequest[];
  customerId?: number;
  discount: number;
  note?: string;
}

export interface PosCheckoutItemDto {
  medicineId: number;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PosCheckoutPaymentDto {
  method: "cash" | "card";
  amount: number;
}

export interface PosCartItem {
  medicineId: number;
  name: string;
  price: number;
  quantity: number;
  availableStock: number;
}

export interface PosCheckoutResultDto {
  saleId: number;
  paymentIds: number[];
  status: string;
  subtotal: number;
  discount: number;
  totalAmount: number;
  payments: PosCheckoutPaymentDto[];
  paidAmount: number;
  changeAmount: number;
  items: PosCheckoutItemDto[];
  createdAt: string;
  customerId: number | null;
  customerName: string | null;
  userName: string | null;
}

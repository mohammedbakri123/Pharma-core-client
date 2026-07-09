import { PaymentMethod } from "../../finance/common/types/payment";

export interface PosCheckoutItemRequest {
  medicineId: number;
  quantity: number;
}

export interface PosPaymentRequest {
  method: PaymentMethod;
  amount: number;
}

export interface PosCheckoutRequest {
  items: PosCheckoutItemRequest[];
  payment: PosPaymentRequest;
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

export interface PosCheckoutResultDto {
  saleId: number;
  paymentId: number;
  status: string;
  subtotal: number;
  discount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paidAmount: number;
  change: number;
  items: PosCheckoutItemDto[];
  createdAt: string;
  customerId: number | null;
  customerName: string | null;
  userName: string | null;
}

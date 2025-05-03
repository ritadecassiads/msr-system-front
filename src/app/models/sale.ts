import { Client } from "./client";
import { Employee } from "./employee";
import { Installment } from "./installment";
import { Product } from "./products";
import { SaleProduct } from "./sale-product";

export interface Sale {
  _id?: string;
  code?: number;
  products: SaleProduct[];
  clientId?: Client;
  openedByEmployee: Employee;
  itensQuantity: number;
  total: number;
  notes?: string;
  status?: "open" | "closed" | "canceled";
  paymentMethod?:
    | "credit-card"
    | "debit-card"
    | "cash"
    | "pix"
    | "bank-transfer"
    | "client-account";
  discount: number;
  createdAt: Date;
  installments?: Installment[];
}

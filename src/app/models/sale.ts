import { Client } from "./client";
import { Employee } from "./employee";
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
    | "credit"
    | "debit"
    | "cash"
    | "pix"
    | "bankTransfer"
    | "other";
  discount: number;
  createdAt: Date;
}

import { Client } from "./client";
import { Employee } from "./employee";
import { Product } from "./products";

export interface Sale {
  _id?: string;
  code?: number;
  products: Product[];
  clientId?: Client;
  openedByEmployee: Employee;
  quantity: number;
  totalPrice: number;
  notes?: string;
  status?: "open" | "close";
  paymentMethod?: "credit" | "debit" | "cash" | "pix" | "bankTransfer";
}

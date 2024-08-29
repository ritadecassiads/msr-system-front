import { Client } from "./client";
import { Employee } from "./employee";
import { Product } from "./products";

export interface Sale {
  id?: string;
  code?: number;
  products: Product[];
  clientId?: Client;
  sellerId: Employee;
  quantity: number;
  totalPrice: number;
  observations?: string;
  status: "open" | "close";
}

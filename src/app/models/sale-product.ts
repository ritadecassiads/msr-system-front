import { Category } from "./category";
import { Supplier } from "./supplier";

export interface SaleProduct {
  _id?: string;
  code?: number;
  name: string;
  unitPrice: number;
  totalPrice: number;
  quantity: number;
}

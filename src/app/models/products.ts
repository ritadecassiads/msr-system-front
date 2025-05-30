import { Category } from "./category";
import { Supplier } from "./supplier";

export interface Product {
  _id?: string;
  code?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  supplierId?: Supplier;
  categories: Category[];
  createdAt?: Date;
}

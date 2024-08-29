import { Category } from "./category";
import { Supplier } from "./supplier";

export interface Product {
  id?: number;
  code?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  supplierId?: Supplier;
  categories: Category[];
}

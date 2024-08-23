import { Category } from "./category";

export interface Product {
    id?: number;
    code?: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    supplierId?: string;
    category: Category[];
}

import { Product } from "./products";

export interface Category {
    id?: number
    code?: number;
    name: string;
    description?: string;
    price: number;
    products: Product[];
}

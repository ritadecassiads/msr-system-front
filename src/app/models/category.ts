import { Product } from "./products";

export interface Category {
    code: number;
    name: string;
    description: string;
    price: number;
    products: Product[];
}

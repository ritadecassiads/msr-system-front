import { Category } from "./category";

export interface Product {
    code?: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    createdAt: Date;
    //category: Category[];
}

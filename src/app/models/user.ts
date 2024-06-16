import { Address } from "./address";

export interface User {
    code: number;
    name: string;
    username: string;
    password: string;
    cpf: string;
    address: Address;
    phone: string;
    admissionDate: Date;
    isAdmin: boolean;
}

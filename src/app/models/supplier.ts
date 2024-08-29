import { Address } from "./address";

export interface Supplier {
  _id?: number;
  code: number;
  name: string;
  cnpj: string;
  phone?: string;
  email?: string;
  contactPerson?: string;
  observations?: string;
  address?: Address;
}

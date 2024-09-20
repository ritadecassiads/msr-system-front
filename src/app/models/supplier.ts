import { Address } from "./address";

export interface Supplier {
  _id?: string;
  code: number;
  name: string;
  cnpj: string;
  phone?: string;
  email?: string;
  contactPerson?: string;
  notes?: string;
  address?: Address;
}

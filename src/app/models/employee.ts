import { Address } from "./address";

export interface Employee {
  _id?: string;
  code?: number;
  name: string;
  username: string;
  password: string;
  cpf: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  address: Address
}

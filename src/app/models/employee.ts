import { Address } from "./address";

export interface Employee {
  id?: number;
  name: string;
  username: string;
  password: string;
  cpf: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  address: Address
}

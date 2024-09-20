import { Address } from "./address";
import { Employee } from "./employee";

export interface Client {
  _id?: string;
  code?: number;
  name: string;
  birthDate: Date;
  cpf: string;
  rg: string;
  address: Address;
  phone: string;
  email?: string;
  createdAt?: Date;
  purchaseLimit?: number;
  notes?: string;
  createdByEmployee?: Employee; // tirar a interrogação depois
  fathersName?: string;
  mothersName?: string;
  peopleAuthorized?: string;
  timesCharged?: number;
  spcInclusionDate?: Date;
  spcExclusionDate?: Date;
  spcExclusionReason?: string;
}

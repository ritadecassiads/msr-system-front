import { Address } from "./address";
import { Employee } from "./employee";

export interface Client {
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
    observations?: string;
    createdByUser?: Employee; // tirar a interrogação depois
    fathersName?: string;
    mothersName?: string;
    peopleAuthorized?: string;
    timesCharged?: number;
    spcInclusionDate?: Date;
    spcExclusionDate?: Date;
    spcExclusionReason?: string;
}

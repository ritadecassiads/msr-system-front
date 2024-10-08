import { Supplier } from "./supplier";

export interface Invoice {
  _id?: string;
  code?: number;
  amount: number;
  issueDate: Date; // emissão
  dueDate: Date; // vencimento
  supplierId: string;
  installments: number; // parcelas
  status: "open" | "paid" | "overdue";
  notes?: string;
  installmentAmounts?: number[];
}

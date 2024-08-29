import { Supplier } from "./supplier";

export interface Invoice {
  id?: string;
  code?: number;
  supplierId: Supplier;
  issueDate: Date; // emissão
  dueDate: Date; // vencimento
  amount: number;
  installments: number; // parcelas
  status: "open" | "paid" | "overdue";
  notes?: string;
}

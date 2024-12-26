import { Installment } from "./installment";
import { Supplier } from "./supplier";

export interface Invoice {
  _id?: string;
  code?: number;
  totalAmount: number;
  issueDate?: Date; // emissão
  dueDate?: Date; // vencimento
  supplierId: Supplier;
  installments?: Installment[]; // parcelas
  status: "unpaid" | "paid" | "overdue";
  notes?: string;
  description?: string;
}

export interface Installment {
  dueDate?: Date; // vencimento
  amount: number;
  status:  "unpaid" | "paid" | "overdue";
}

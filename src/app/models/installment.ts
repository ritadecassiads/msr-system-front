export interface Installment {
  _id?: string;
  dueDate?: Date;
  amount: number;
  status:  "unpaid" | "paid" | "overdue";
}

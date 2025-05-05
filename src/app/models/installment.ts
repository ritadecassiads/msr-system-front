export interface Installment {
  _id?: string;
  dueDate?: Date;
  amount: number;
  status:  "pending" | "paid" | "overdue";
  paymentDate?: Date;
  paymentMethod?:
  | "credit"
  | "debit"
  | "cash"
  | "pix"
  | "bankTransfer";
}

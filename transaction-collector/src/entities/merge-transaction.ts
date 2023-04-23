import { CancelStatus } from "@/contracts/cancle-status";

export class MergeTransaction {
  id?: string;
  amount: number;
  balance: number;
  cancelYn: CancelStatus;
  date: string;
  storeId: string;
  transactionId: string;
  productId: string;

  constructor(
    amount: number,
    balance: number,
    cancelYn: CancelStatus,
    date: string,
    storeId: string,
    transactionId: string,
    productId: string,
    id?: string
  ) {
    this.amount = amount;
    this.balance = balance;
    this.cancelYn = cancelYn;
    this.date = date;
    this.storeId = storeId;
    this.transactionId = transactionId;
    this.productId = productId;
    this.id = id;
  }
}

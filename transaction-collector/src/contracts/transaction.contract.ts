import { CancelStatus } from "@/contracts/cancle-status";

export interface TransactionContract {
  amount: number;
  balance: number;
  cancelYn: CancelStatus;
  date: string; // yyyy-MM-dd
  storeId: string;
  transactionId: string;
}

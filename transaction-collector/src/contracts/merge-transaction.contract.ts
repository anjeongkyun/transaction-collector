import { CancelStatus } from "@/contracts/cancle-status";

export interface MergeTransactionContract {
  amount: number;
  balance: number;
  cancelYn: CancelStatus;
  date: string;
  storeId: string;
  transactionId: string;
  productId: string;
}

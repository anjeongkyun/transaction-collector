import { PageInfo } from "@/contracts/page-info";
import { TransactionContract } from "@/contracts/transaction.contract";

export interface GetTransactionsResponse {
  list: TransactionContract[];
  pageInfo: PageInfo;
}

import { PageInfo } from "@/contracts/page-info";
import { StoreTransactionContract } from "@/contracts/store-transaction.contract";

export interface GetStoreTransactionsResponse {
  list: StoreTransactionContract[];
  pageInfo: PageInfo;
}

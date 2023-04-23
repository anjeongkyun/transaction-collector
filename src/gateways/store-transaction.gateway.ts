import { STORE_TRANSACTION_GATEWAY_BASE_URL } from "@/config";
import { GetStoreTransactionsResponse } from "@/contracts/get-store-transactions-reponse";
import AxiosRetry from "@/utils/axios-retry";

export interface StoreTransactionGateway {
  getStoreTransactions(
    storeId: string,
    date?: string,
    page?: number
  ): Promise<GetStoreTransactionsResponse>;
}

interface GetStoreTransactionQuery {
  date?: string;
  page?: number;
}

export class StoreTransactionGatewayImpl implements StoreTransactionGateway {
  async getStoreTransactions(
    storeId?: string,
    date?: string,
    page?: number
  ): Promise<GetStoreTransactionsResponse> {
    const query: GetStoreTransactionQuery = {
      date,
      page,
    };
    return await AxiosRetry.retryAxios(
      3,
      1000,
      STORE_TRANSACTION_GATEWAY_BASE_URL
    )
      .post(`/store-transaction/${storeId}`, query)
      .then((res) => res.data)
      .catch((err) => console.error(err));
  }
}

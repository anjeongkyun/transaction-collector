import { TRANSACTION_GATEWAY_BASE_URL } from "@/config";
import { GetTransactionsResponse } from "@/contracts/get-transactions-reponse";
import AxiosRetry from "@/utils/axios-retry";

export interface TransactionGateway {
  getTransactions(page?: number): Promise<GetTransactionsResponse>;
}

export class TransactionGatewayImpl implements TransactionGateway {
  async getTransactions(page?: number): Promise<GetTransactionsResponse> {
    const url: string = page
      ? "/transaction" + `?page=${page}`
      : "/transaction";

    return await AxiosRetry.retryAxios(3, 1000, TRANSACTION_GATEWAY_BASE_URL)
      .get(url)
      .then((res) => res.data)
      .catch((err) => console.error(err));
  }
}

import { IJob } from "@/batch/job";
import { MergeTransactionContract } from "@/contracts/merge-transaction.contract";
import { StoreTransactionContract } from "@/contracts/store-transaction.contract";
import { TransactionContract } from "@/contracts/transaction.contract";
import { MergeTransactionRepository } from "@/data/repositories/merge-transaction.repository";
import { StoreTransactionGateway } from "@/gateways/store-transaction.gateway";
import { TransactionGateway } from "@/gateways/transaction.gateway";
import { ReadCsvFileProcessor } from "@/processor/read-csv-file.processor";
import * as cron from "node-cron";

export interface ICollectTransactionsJob extends IJob {
  execute(): Promise<void>;
}

export class CollectTransactionsJob implements ICollectTransactionsJob {
  private readonly csvPath = "../../csv/transaction.csv";
  private readonly readCsvFileProcessor: ReadCsvFileProcessor;
  private readonly transactionGateway: TransactionGateway;
  private readonly storeTransactionGateway: StoreTransactionGateway;
  private readonly mergeTransactionRepository: MergeTransactionRepository;
  constructor(
    readCsvFileProcessor: ReadCsvFileProcessor,
    transactionGateway: TransactionGateway,
    storeTransactionGateway: StoreTransactionGateway,
    mergeTransactionRepository: MergeTransactionRepository
  ) {
    this.readCsvFileProcessor = readCsvFileProcessor;
    this.transactionGateway = transactionGateway;
    this.storeTransactionGateway = storeTransactionGateway;
    this.mergeTransactionRepository = mergeTransactionRepository;
  }

  initialize(): void {
    cron.schedule("*/10 * * * *", () => {
      this.execute();
    });
  }

  public async execute(): Promise<void> {
    const aggregatedTransactions: TransactionContract[] =
      await this.aggregateTransactions();

    const mergeTransactions: MergeTransactionContract[] =
      await this.mergeTransactions(aggregatedTransactions);

    return await this.mergeTransactionRepository.bulkInsertMergeTransactions(
      mergeTransactions
    );
  }

  aggregateTransactions = async (): Promise<TransactionContract[]> => {
    return [
      ...(await this.makeTransactions()),
      ...(await this.makeCsvTransactions()),
    ];
  };

  makeTransactions = async (): Promise<TransactionContract[]> => {
    const totalPage: number = await this.transactionGateway
      .getTransactions()
      .then((_) => _?.pageInfo?.totalPage);

    const transactions: TransactionContract[][] = await Promise.all(
      Array.from({ length: totalPage }, (_, i) => i + 1).flatMap((page) =>
        this.transactionGateway.getTransactions(page).then((_) => _.list)
      )
    );
    return transactions.flat();
  };

  makeCsvTransactions = async (): Promise<TransactionContract[]> => {
    return await this.readCsvFileProcessor.process(this.csvPath);
  };

  mergeTransactions = async (transactions: TransactionContract[]) => {
    const mergeTransactions: MergeTransactionContract[][] = await Promise.all(
      transactions.map((transaction) =>
        this.makeStoreTransactions(transaction).then((storeTransaction) =>
          storeTransaction.map((_) => {
            return {
              ...transaction,
              productId: _.productId,
            };
          })
        )
      )
    );
    return mergeTransactions.flat();
  };

  makeStoreTransactions = async (
    transaction: TransactionContract
  ): Promise<StoreTransactionContract[]> => {
    const totalPage: number = await this.storeTransactionGateway
      .getStoreTransactions(transaction.storeId)
      .then((_) => _?.pageInfo?.totalPage);

    const storeTransactions: StoreTransactionContract[][] = await Promise.all(
      Array.from({ length: totalPage }, (_, i) => i + 1).flatMap((page) =>
        this.storeTransactionGateway
          .getStoreTransactions(transaction.storeId, transaction.date, page)
          .then((_) => _.list)
      )
    );
    return storeTransactions.flat();
  };
}

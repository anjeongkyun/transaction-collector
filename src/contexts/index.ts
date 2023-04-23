import { CollectTransactionsJob } from "@/batch/collect-transactions-job";
import {
  MergeTransactionRepository,
  MergeTransactionRepositoryImpl,
} from "@/data/repositories/merge-transaction.repository";
import {
  StoreTransactionGateway,
  StoreTransactionGatewayImpl,
} from "@/gateways/store-transaction.gateway";
import {
  TransactionGateway,
  TransactionGatewayImpl,
} from "@/gateways/transaction.gateway";
import { ReadCsvFileProcessor } from "@/processor/read-csv-file.processor";
import { GetMergeTransactionsUsecase } from "@/usecases/get-merge-transactions.usecase";

class RepositoryContext {
  mergeTransactionRepository: MergeTransactionRepository;
  constructor() {
    this.mergeTransactionRepository = new MergeTransactionRepositoryImpl();
  }
}

export class UsecaseContext {
  getMergeTransactionsUsecase: GetMergeTransactionsUsecase;
  constructor(repositoryContext: RepositoryContext) {
    this.getMergeTransactionsUsecase = new GetMergeTransactionsUsecase(
      repositoryContext.mergeTransactionRepository
    );
  }
}

export class ProcessorContext {
  readCsvFileProcessor: ReadCsvFileProcessor;
  constructor() {
    this.readCsvFileProcessor = new ReadCsvFileProcessor();
  }
}

class GatewayContext {
  storeTransactionGateway: StoreTransactionGateway;
  transactionGateway: TransactionGateway;

  constructor() {
    this.storeTransactionGateway = new StoreTransactionGatewayImpl();
    this.transactionGateway = new TransactionGatewayImpl();
  }
}

class BatchContext {
  collectTransactionsJob: CollectTransactionsJob;
  constructor(
    gatewayContext: GatewayContext,
    processorContext: ProcessorContext,
    repositoryContext: RepositoryContext
  ) {
    this.collectTransactionsJob = new CollectTransactionsJob(
      processorContext.readCsvFileProcessor,
      gatewayContext.transactionGateway,
      gatewayContext.storeTransactionGateway,
      repositoryContext.mergeTransactionRepository
    );
  }
}

export const repositoryContext: RepositoryContext = new RepositoryContext();
export const usecaseContext: UsecaseContext = new UsecaseContext(
  repositoryContext
);

export const gatewayContext: GatewayContext = new GatewayContext();
export const processorContext: ProcessorContext = new ProcessorContext();
export const batchContext: BatchContext = new BatchContext(
  gatewayContext,
  processorContext,
  repositoryContext
);

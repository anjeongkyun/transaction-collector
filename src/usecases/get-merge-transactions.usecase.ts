import { GetMergeTransactionsQuery } from "@/contracts/get-merge-transactions.query";
import { MergeTransactionRepository } from "@/data/repositories/merge-transaction.repository";
import { MergeTransaction } from "@/entities/merge-transaction";
import { optional } from "@/utils/util";
import { parseISO } from "date-fns";

export class GetMergeTransactionsUsecase {
  private repository: MergeTransactionRepository;

  constructor(repository: MergeTransactionRepository) {
    this.repository = repository;
  }

  process(query?: GetMergeTransactionsQuery): Promise<MergeTransaction[]> {
    return this.repository.getMergeTransactions(
      optional(query.startDate, (it: string) => parseISO(it)),
      optional(query.endDate, (it: string) => parseISO(it))
    );
  }
}

import { mergeTransactionDataModel } from "@/data/models/merge-transaction.model";
import { MergeTransaction } from "@/entities/merge-transaction";
import { MergeTransactionDataMapper } from "../mappers/merge-transaction.data.mapper";

export interface MergeTransactionRepository {
  getMergeTransactions(
    startDate?: Date,
    endDate?: Date
  ): Promise<MergeTransaction[]>;
  createMergeTransaction(
    mergeTransaction: MergeTransaction
  ): Promise<MergeTransaction>;
  bulkInsertMergeTransactions(
    mergeTransactions: MergeTransaction[]
  ): Promise<void>;
}

export class MergeTransactionRepositoryImpl
  implements MergeTransactionRepository
{
  private mapper: MergeTransactionDataMapper = new MergeTransactionDataMapper();

  async getMergeTransactions(
    startDate?: Date,
    endDate?: Date
  ): Promise<MergeTransaction[]> {
    const query: any = {};
    if (startDate) {
      query.date = { ...query.date, $gte: startDate };
    }
    if (endDate) {
      query.date = { ...query.date, $lte: endDate };
    }
    return mergeTransactionDataModel
      .find(query)
      .exec()
      .then((documents) => documents.map(this.mapper.toEntity));
  }

  createMergeTransaction(
    mergeTransaction: MergeTransaction
  ): Promise<MergeTransaction> {
    return mergeTransactionDataModel
      .create(this.mapper.toDocument(mergeTransaction))
      .then(this.mapper.toEntity);
  }

  async bulkInsertMergeTransactions(
    mergeTransactions: MergeTransaction[]
  ): Promise<void> {
    const MAX_DOCS_PER_BATCH = 20000;
    if (mergeTransactions.length <= MAX_DOCS_PER_BATCH) {
      await mergeTransactionDataModel
        .insertMany(mergeTransactions, { ordered: false })
        .catch((err) => {
          if (err.code !== 11000) throw err;
        });
    } else {
      for (let i = 0; i < mergeTransactions.length; i += MAX_DOCS_PER_BATCH) {
        const batch = mergeTransactions.slice(i, i + MAX_DOCS_PER_BATCH);
        await mergeTransactionDataModel
          .insertMany(batch, { ordered: false })
          .catch((err) => {
            if (err.code !== 11000) throw err;
          });
      }
    }
  }
}

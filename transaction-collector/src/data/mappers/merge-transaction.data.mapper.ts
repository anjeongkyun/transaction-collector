import { MergeTransactionDocument } from "@/data/models/merge-transaction.model";
import { MergeTransaction } from "@/entities/merge-transaction";
import { optional } from "@/utils/util";
import { parseISO } from "date-fns";

export class MergeTransactionDataMapper {
  toEntity(document: MergeTransactionDocument): MergeTransaction {
    return new MergeTransaction(
      document.amount,
      document.balance,
      document.cancelYn,
      document.date.toISOString().substring(0, 10),
      document.storeId,
      document.transactionId,
      document.productId,
      document._id.toString()
    );
  }

  toDocument(entity: MergeTransaction): MergeTransactionDocument {
    return {
      amount: entity.amount,
      balance: entity.balance,
      cancelYn: entity.cancelYn,
      date: optional(entity.date, (it: string) => parseISO(it)),
      storeId: entity.storeId,
      transactionId: entity.transactionId,
      productId: entity.productId,
    };
  }
}

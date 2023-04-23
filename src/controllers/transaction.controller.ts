import { UsecaseContext } from "@/contexts";
import { MergeTransaction } from "@/entities/merge-transaction";
import { GetMergeTransactionsUsecase } from "@/usecases/get-merge-transactions.usecase";
import { NextFunction, Request, Response } from "express";
import { GetMergeTransactionsQuery } from "@/contracts/get-merge-transactions.query";

export class TransactionController {
  private getMergeTransactionsUsecase: GetMergeTransactionsUsecase;

  constructor(usecaseContext: UsecaseContext) {
    this.getMergeTransactionsUsecase =
      usecaseContext.getMergeTransactionsUsecase;
  }

  getMergeTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const query: GetMergeTransactionsQuery = req.body;
    this.getMergeTransactionsUsecase
      .process(query)
      .then((result: MergeTransaction[]) =>
        res.status(200).json({ data: result })
      )
      .catch((err) => {
        console.error(err);
        next(err);
      });
  };
}

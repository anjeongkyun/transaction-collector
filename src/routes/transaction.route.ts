import { UsecaseContext } from "@/contexts";
import { TransactionController } from "@/controllers/transaction.controller";
import { Route } from "@/routes/route";
import { Router } from "express";

export class TransactionRoute implements Route {
  router: Router = Router();
  private controller: TransactionController;
  constructor(usecaseContext: UsecaseContext) {
    this.controller = new TransactionController(usecaseContext);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/transactions/queries/get-merge-transactions",
      this.controller.getMergeTransactions
    );
  }
}

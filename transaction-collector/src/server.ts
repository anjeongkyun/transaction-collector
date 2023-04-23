import validateEnv from "./utils/validate-env";
import App from "@/app";
import { HealthRoute } from "@/routes/health.route";
import { TransactionRoute } from "@/routes/transaction.route";
import { batchContext, usecaseContext } from "@/contexts";

validateEnv();

const app = new App(
  [new HealthRoute(), new TransactionRoute(usecaseContext)],
  [batchContext.collectTransactionsJob]
);

app.listen();

import { config } from "dotenv";
import * as process from "process";

config({ path: `.env` });

export const {
  PORT,
  DB_URL,
  TRANSACTION_GATEWAY_BASE_URL,
  STORE_TRANSACTION_GATEWAY_BASE_URL,
} = process.env;

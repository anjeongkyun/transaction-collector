import { TransactionContract } from "@/contracts/transaction.contract";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";

export class ReadCsvFileProcessor {
  async process(csvPath: string): Promise<TransactionContract[]> {
    const csvFilePath = path.resolve(__dirname, csvPath);

    const csvData: string = await fs.promises.readFile(csvFilePath, {
      encoding: "utf-8",
    });

    const csvParser = parse(csvData, {
      delimiter: ",",
      columns: true,
    });

    const results: TransactionContract[] = [];
    for await (const row of csvParser) {
      results.push(row as TransactionContract);
    }

    return results;
  }
}

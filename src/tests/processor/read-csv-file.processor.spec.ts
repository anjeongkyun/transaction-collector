import { TransactionContract } from "@/contracts/transaction.contract";
import { ReadCsvFileProcessor } from "@/processor/read-csv-file.processor";

describe("readCsvFileProcessor Tests", () => {
  test("should correctly read and parse a CSV file and return transactions", async () => {
    //Arrange
    const sut = getSut();
    const csvPath = "../../csv/transaction-test.csv";

    //Act
    const actual: TransactionContract[] = await sut.process(csvPath);

    //Assert
    expect(actual).not.toBeNull();
    expect(actual.length).toBeGreaterThan(0);
  });
});

const getSut = (): ReadCsvFileProcessor => {
  return new ReadCsvFileProcessor();
};

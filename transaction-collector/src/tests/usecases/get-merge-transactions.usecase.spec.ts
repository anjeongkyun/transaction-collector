import { MergeTransaction } from "@/entities/merge-transaction";
import { clear, close, connect } from "@/tests/settings/database";
import { faker } from "@faker-js/faker";
import { GetMergeTransactionsQuery } from "@/contracts/get-merge-transactions.query";
import { MergeTransactionRepositoryImpl } from "@/data/repositories/merge-transaction.repository";
import { GetMergeTransactionsUsecase } from "@/usecases/get-merge-transactions.usecase";
import { CancelStatus } from "@/contracts/cancle-status";
import { add } from "date-fns";

beforeAll(async () => await connect());
beforeEach(async () => await clear());
afterAll(async () => await close());

describe("getMergeTransactionsUsecase Tests", () => {
  describe("when querying mergeTransactions within a date range", () => {
    it.each([
      [
        [
          new MergeTransaction(
            faker.datatype.number(10000),
            faker.datatype.number(10000),
            "N" as CancelStatus,
            new Date().toISOString().substring(0, 10),
            faker.random.alpha(5),
            faker.random.alpha(5),
            faker.datatype.uuid(),
            faker.random.alpha(5)
          ),
          new MergeTransaction(
            faker.datatype.number(10000),
            faker.datatype.number(10000),
            "Y" as CancelStatus,
            new Date().toISOString().substring(0, 10),
            faker.random.alpha(5),
            faker.random.alpha(5),
            faker.datatype.uuid(),
            faker.random.alpha(5)
          ),
        ],
        add(new Date(), { days: -7 }).toISOString().substring(0, 10),
        add(new Date(), { days: 7 }).toISOString().substring(0, 10),
      ],
      [
        [
          new MergeTransaction(
            faker.datatype.number(10000),
            faker.datatype.number(10000),
            "N" as CancelStatus,
            new Date().toISOString().substring(0, 10),
            faker.random.alpha(5),
            faker.random.alpha(5),
            faker.datatype.uuid(),
            faker.random.alpha(5)
          ),
          new MergeTransaction(
            faker.datatype.number(10000),
            faker.datatype.number(10000),
            "Y" as CancelStatus,
            new Date().toISOString().substring(0, 10),
            faker.random.alpha(5),
            faker.random.alpha(5),
            faker.datatype.uuid(),
            faker.random.alpha(5)
          ),
        ],
        add(new Date(), { days: -7 }).toISOString().substring(0, 10),
        add(new Date(), { days: 7 }).toISOString().substring(0, 10),
      ],
    ])(
      "should return all mergeTransactions created within the given date range",
      async (mergeTransactions, startDate, endDate) => {
        //Arrange
        const sut = getSut();
        const createdTransactions: MergeTransaction[] =
          await createMergeTransactions(mergeTransactions);

        const query: GetMergeTransactionsQuery = {
          startDate,
          endDate,
        };

        //Act
        const actual: MergeTransaction[] = await sut.process(query);

        //Assert
        expect(actual).not.toBeNull();
        expect(actual.length).toStrictEqual(createdTransactions.length);
        expect(
          actual.every(
            (_) =>
              createdTransactions.map((it) => it.id).includes(_.id) &&
              createdTransactions.map((it) => it.amount).includes(_.amount) &&
              createdTransactions.map((it) => it.balance).includes(_.balance) &&
              createdTransactions
                .map((it) => it.cancelYn)
                .includes(_.cancelYn) &&
              createdTransactions.map((it) => it.date).includes(_.date) &&
              createdTransactions.map((it) => it.storeId).includes(_.storeId) &&
              createdTransactions
                .map((it) => it.transactionId)
                .includes(_.transactionId) &&
              createdTransactions
                .map((it) => it.productId)
                .includes(_.productId)
          )
        ).toBeTruthy();
      }
    );
  });
});

const createMergeTransactions = async (
  transactions: MergeTransaction[]
): Promise<MergeTransaction[]> => {
  return await Promise.all(
    transactions.map((transaction) =>
      new MergeTransactionRepositoryImpl().createMergeTransaction(
        new MergeTransaction(
          transaction.amount,
          transaction.balance,
          transaction.cancelYn,
          transaction.date,
          transaction.storeId,
          transaction.transactionId,
          transaction.productId
        )
      )
    )
  );
};

const getSut = (): GetMergeTransactionsUsecase => {
  return new GetMergeTransactionsUsecase(new MergeTransactionRepositoryImpl());
};

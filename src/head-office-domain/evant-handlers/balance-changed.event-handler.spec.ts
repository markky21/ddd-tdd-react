import { getHeadOfficeRepositoryFixture } from "../repository/head-office.repository.fixtures";
import { BalanceChangedEventHandler } from "./balance-changed.event-handler";
import { BalanceChangedEvent } from "../../atm-domain/events/balance-changed.event";
import { Cash } from "../../shared-kernel/value-objects/cash";
import { expect } from "vitest";
import { EntityId } from "../../common/entities/entity.abstract";

const getSUT = async () => {
  const fixture = await getHeadOfficeRepositoryFixture();
  const handler = new BalanceChangedEventHandler();
  return { handler, fixture };
};

test("change balance and save it in repository", async () => {
  const {
    handler,
    fixture: { headOfficeRepository, dbFixture },
  } = await getSUT();
  const previousBalance = dbFixture.headOfficeFromDb?.balance as number;

  await handler.handle(new BalanceChangedEvent(new Cash(10)));

  // eslint-disable-next-line testing-library/no-await-sync-query
  const headOfficeFromDB = await headOfficeRepository.getById(
    dbFixture.headOfficeId as EntityId
  );
  expect(headOfficeFromDB.getBalance().amount).toBe(previousBalance + 10);
});

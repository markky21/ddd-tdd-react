import { Initer } from "./initer";
import {
  getTestDb,
  seedTestDb,
} from "../shared-kernel/storage/idb.service.fixture";

const getSUT = async () => {
  const db = await getTestDb();
  const { snackMachineId, atmId, headOfficeId } = await seedTestDb(db);

  const initer = await Initer.init({
    snackMachineId,
    atmId,
  });

  return {
    initer,
    snackMachineId,
    atmId,
    headOfficeId,
  };
};

describe(Initer.name, () => {
  it("should return snackMachine service", async () => {
    const { initer } = await getSUT();

    expect(initer.snackMachineService).toBeTruthy();
  });

  it("should initialize snack machine by given ID", async () => {
    const { snackMachineId, initer } = await getSUT();

    expect(initer.snackMachineService.snackMachineId).toEqual(snackMachineId);
  });

  it("should return atm service", async () => {
    const { initer } = await getSUT();

    expect(initer.atmService).toBeTruthy();
  });

  it("should initialize atm by given ID", async () => {
    const { atmId, initer } = await getSUT();

    expect(initer.atmService.atmId).toEqual(atmId);
  });

  it("should return head-office service", async () => {
    const { initer } = await getSUT();

    expect(initer.headOfficeService).toBeTruthy();
  });

  it("should initialize head-office by given ID", async () => {
    const { headOfficeId, initer } = await getSUT();

    expect(initer.headOfficeService.id).toEqual(headOfficeId);
  });
});

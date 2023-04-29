import { SnackMachineService } from "./snack-machine.service";
import { getSnackMachineRepositoryFixture } from "../repository/snack-machine.repository.fixtures";

export const getSnackMachineServiceFixture = async () => {
  const { dbFixture, ...snackMachineRepositoryFixture } =
    await getSnackMachineRepositoryFixture();

  const service = new SnackMachineService(
    snackMachineRepositoryFixture.snackMachineRepository,
    snackMachineRepositoryFixture.snackRepository
  );

  await service.initializeSnackMachine(dbFixture.snackMachineId);

  return {
    service,
    dbFixture,
    snackMachineRepositoryFixture,
  };
};

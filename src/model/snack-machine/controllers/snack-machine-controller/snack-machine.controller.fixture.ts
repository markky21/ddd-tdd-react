import { SnackMachineController } from "./snack-machine.controller";
import { getSnackMachineRepositoryFixture } from "../../repositories/snack-machine.repository.fixtures";

export const getSnackMachineControllerFixture = async () => {
  const { dbFixture, ...snackMachineRepositoryFixture } =
    await getSnackMachineRepositoryFixture();

  const controller = new SnackMachineController(
    snackMachineRepositoryFixture.snackMachineRepository,
    snackMachineRepositoryFixture.snackRepository
  );

  await controller.initializeSnackMachine(dbFixture.snackMachineId);

  return {
    controller,
    dbFixture,
    snackMachineRepositoryFixture,
  };
};

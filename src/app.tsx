import "./app.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { SnackMachineInterface } from "./snack-machine-domain/view/organisms/snack-machine-interface";
import { SnackMachineService } from "./snack-machine-domain/service/snack-machine.service";
import { Atm } from "./atm-domain/view/organisms/atm";

interface AppProps {
  snackMachine: SnackMachineService;
}

export function App({ snackMachine }: AppProps) {
  return (
    <main className="p-4">
      <SnackMachineInterface snackMachine={snackMachine} />
      <Atm />
    </main>
  );
}

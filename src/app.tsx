import "./app.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { SnackMachineInterface } from "./view/organisms/snack-machine-interface";
import { SnackMachineController } from "./model/snack-machine/controllers/snack-machine-controller/snack-machine.controller";

interface AppProps {
  snackMachine: SnackMachineController;
}

export function App({ snackMachine }: AppProps) {
  return (
    <main className="p-4">
      <SnackMachineInterface snackMachine={snackMachine} />
    </main>
  );
}

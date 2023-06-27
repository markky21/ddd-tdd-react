import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Initer } from "./util/initer";
import { SnackMachineInterface } from "./snack-machine-domain/view/organisms/snack-machine-interface";
import { Atm } from "./atm-domain/view/organisms/atm";

const SNACK_MACHINE_ID = "snack-machine-1";

Initer.init({ snackMachineId: SNACK_MACHINE_ID }).then(
  (snackMachineController) => {
    ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
      <React.StrictMode>
        <main className="p-4">
          <SnackMachineInterface snackMachine={snackMachineController} />
          <Atm />
        </main>
      </React.StrictMode>
    );
  }
);

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Initer } from "./util/initer";
import { SnackMachineInterface } from "./snack-machine-domain/view/organisms/snack-machine-interface";
import { Atm } from "./atm-domain/view/organisms/atm";

const SNACK_MACHINE_ID = "snack-machine-1";
const ATM_ID = "atm-1";

Initer.init({
  atmId: ATM_ID,
  snackMachineId: SNACK_MACHINE_ID,
}).then(({ snackMachineService, atmService }) => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <main className="p-4">
        <SnackMachineInterface snackMachineService={snackMachineService} />
        <Atm atmService={atmService} />
      </main>
    </React.StrictMode>
  );
});

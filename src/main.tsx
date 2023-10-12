import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Initer } from "./util/initer";
import { SnackMachineInterface } from "./snack-machine-domain/view/organisms/snack-machine-interface";
import { Atm } from "./atm-domain/view/organisms/atm";
import { HeadOffice } from "./head-office-domain/view/templates/head-office";

const SNACK_MACHINE_ID = "snack-machine-1";
const ATM_ID = "atm-1";

Initer.init({
  atmId: ATM_ID,
  snackMachineId: SNACK_MACHINE_ID,
}).then(({ snackMachineService, atmService }) => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <main className="p-4 flex flex-wrap gap-8 container">
        <HeadOffice />
        <SnackMachineInterface snackMachineService={snackMachineService} />
        <Atm atmService={atmService} />
      </main>
    </React.StrictMode>
  );
});

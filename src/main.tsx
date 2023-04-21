import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app";
import "./index.css";
import { Initer } from "./initer";

const SNACK_MACHINE_ID = "snack-machine-1";

Initer.init({ snackMachineId: SNACK_MACHINE_ID }).then(
  (snackMachineController) => {
    ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
      <React.StrictMode>
        <App snackMachine={snackMachineController} />
      </React.StrictMode>
    );
  }
);

import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app";
import "./index.css";
import { IdbService } from "./model/snack-machine/data-access/idb.service";
import { SnackMachineWithPersistence } from "./model/snack-machine/core/entities/snack-machine-with-persistence";
import { SnackMachineController } from "./model/snack-machine/controllers/snack-machine-controller/snack-machine.controller";

const db = new IdbService();
Promise.all([db.initialize()]).then(async () => {
  const snackMachine = new SnackMachineWithPersistence(1, db);
  await snackMachine.load();
  const snackMachineController = new SnackMachineController(snackMachine);

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App snackMachine={snackMachineController} />
    </React.StrictMode>
  );
});

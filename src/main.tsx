import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app";
import "./index.css";
import { Initer } from "./initer";

Initer.init({ dbId: "1" }).then((snackMachineController) => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App snackMachine={snackMachineController} />
    </React.StrictMode>
  );
});

import "./app.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { SnackMachineInterface } from "./view/organisms/snack-machine-interface";
import { SnackMachine } from "./model/snack-machine/core/entities/snack-machine";

const snackMachine = new SnackMachine(1);
function App() {
  return (
    <main className="p-4">
      <SnackMachineInterface snackMachine={snackMachine} />
    </main>
  );
}

export default App;

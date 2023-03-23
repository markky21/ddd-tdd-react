import "./App.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { SnackMachineInterface } from "./view/organisms/snack-machine-interface";

function App() {
  return (
    <main className="p-4">
      <SnackMachineInterface />
    </main>
  );
}

export default App;

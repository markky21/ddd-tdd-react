import { Button } from "../atoms/button";
import { Card } from "../atoms/card";
import { SnackMachineInterfaceController } from "../../controller/snack-machine-interface/snack-machine-interface.controller";
import { SnackMachine } from "../../model/snack-machine/core/entities/snack-machine";
import { useObservableState } from "observable-hooks";
import { useRef } from "react";

interface SnackMachineInterfaceProps {
  snackMachine: SnackMachine;
}
export function SnackMachineInterface({
  snackMachine,
}: SnackMachineInterfaceProps) {
  const controllerRef = useRef(
    new SnackMachineInterfaceController(snackMachine)
  );
  const moneyInside = useObservableState(
    controllerRef.current.moneyInside$,
    ""
  );

  return (
    <Card className="max-w-md">
      <div className="flex flex-col justify-center gap-6">
        <div>
          <Button className="w-full">Buy a snack</Button>
        </div>

        <h3 className="text-center">Money inserted: {moneyInside}</h3>

        <div className="grid grid-cols-3 gap-3">
          <Button onClick={() => controllerRef.current.insertOneCent()}>
            Put ¢1
          </Button>
          <Button onClick={() => controllerRef.current.insertTenCent()}>
            Put ¢10
          </Button>
          <Button onClick={() => controllerRef.current.insertQuarter()}>
            Put ¢25
          </Button>
          <Button onClick={() => controllerRef.current.insertDollar()}>
            Put $1
          </Button>
          <Button onClick={() => controllerRef.current.insertFiveDollar()}>
            Put $5
          </Button>
          <Button onClick={() => controllerRef.current.insertTenDollar()}>
            Put $10
          </Button>
        </div>

        <div>
          <Button className="w-full">Return money</Button>
        </div>

        <div className="flex flex-col">
          <h3 className="text-center">Money inside: </h3>
          <div>¢1: </div>
          <div>¢10: </div>
          <div>¢25: </div>
          <div>$1: </div>
          <div>$5: </div>
          <div>$10: </div>
        </div>
      </div>
    </Card>
  );
}

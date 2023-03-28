import { Button } from "../atoms/button";
import { Card } from "../atoms/card";
import { SnackMachine } from "../../model/snack-machine/core/entities/snack-machine";
import { useObservableState } from "observable-hooks";
import { useRef } from "react";
import { SnackMachineInterfaceService } from "../../services/snack-machine-interface/snack-machine-interface.service";

interface SnackMachineInterfaceProps {
  snackMachine: SnackMachine;
}
export function SnackMachineInterface({
  snackMachine,
}: SnackMachineInterfaceProps) {
  const serviceRef = useRef(new SnackMachineInterfaceService(snackMachine));

  const moneyInserted = useObservableState(
    serviceRef.current.moneyInserted$,
    ""
  );
  const message = useObservableState(serviceRef.current.message$, "");
  const coinsAndNotes = useObservableState(
    serviceRef.current.coinsAndNotes$,
    null
  );

  return (
    <Card className="max-w-md">
      <div className="flex flex-col justify-center gap-6">
        <div>
          <Button
            className="w-full"
            onClick={() => serviceRef.current.buySnack()}
            data-testid="buttonBuySnack"
          >
            Buy a snack
          </Button>
        </div>

        <h3 className="text-center" data-testid="insertedMoney">
          Money inserted: {moneyInserted}
        </h3>

        <div className="grid grid-cols-3 gap-3" data-testid="insertMoney">
          <Button onClick={() => serviceRef.current.insertOneCent()}>
            Put ¢1
          </Button>
          <Button onClick={() => serviceRef.current.insertTenCent()}>
            Put ¢10
          </Button>
          <Button onClick={() => serviceRef.current.insertQuarter()}>
            Put ¢25
          </Button>
          <Button onClick={() => serviceRef.current.insertDollar()}>
            Put $1
          </Button>
          <Button onClick={() => serviceRef.current.insertFiveDollar()}>
            Put $5
          </Button>
          <Button onClick={() => serviceRef.current.insertTenDollar()}>
            Put $10
          </Button>
        </div>

        <div>
          <Button
            className="w-full"
            onClick={() => serviceRef.current.returnMoney()}
            data-testid="buttonReturnMoney"
          >
            Return money
          </Button>
        </div>

        <div className="h-6 text-center" data-testid="message">
          {message}
        </div>

        <div className="flex flex-col" data-testid="moneyInside">
          <h3 className="text-center">Money inside: </h3>
          <div>¢1: {coinsAndNotes?.oneCentCount}</div>
          <div>¢10: {coinsAndNotes?.tenCentCount}</div>
          <div>¢25: {coinsAndNotes?.quarterCentCount}</div>
          <div>$1: {coinsAndNotes?.oneDollarCount}</div>
          <div>$5: {coinsAndNotes?.fiveDollarCount}</div>
          <div>$10: {coinsAndNotes?.tenDollarCount}</div>
        </div>
      </div>
    </Card>
  );
}

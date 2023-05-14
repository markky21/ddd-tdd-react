import { Button } from "../atoms/button";
import { Card } from "../atoms/card";
import { useObservableState } from "observable-hooks";
import { SnackMachineService } from "../../service/snack-machine.service";
import { Snacks } from "../molecule/snacks";

interface SnackMachineInterfaceProps {
  snackMachine: SnackMachineService;
}
export function SnackMachineInterface({
  snackMachine,
}: SnackMachineInterfaceProps) {
  const moneyInserted = useObservableState(snackMachine.moneyInserted$, "");
  const message = useObservableState(snackMachine.message$, "");
  const coinsAndNotes = useObservableState(snackMachine.coinsAndNotes$, null);
  const moneyInMachine = useObservableState(snackMachine.moneyInMachine$, null);
  const slots = useObservableState(snackMachine.snacks$, []);

  return (
    <Card className="max-w-xl">
      <div className="flex flex-col justify-center gap-6">
        <div className="flex gap-4">
          <Snacks slots={slots} />

          <div>
            <Button
              className="w-full"
              onClick={() => snackMachine.buySnack(0)}
              data-testid="buttonBuySnack0"
            >
              Buy a snack 1
            </Button>
            <Button
              className="w-full"
              onClick={() => snackMachine.buySnack(1)}
              data-testid="buttonBuySnack1"
            >
              Buy a snack 2
            </Button>
            <Button
              className="w-full"
              onClick={() => snackMachine.buySnack(2)}
              data-testid="buttonBuySnack2"
            >
              Buy a snack 3
            </Button>
          </div>
        </div>

        <h3 className="text-center" data-testid="insertedMoney">
          Money inserted: {moneyInserted}
        </h3>

        <div className="grid grid-cols-3 gap-3" data-testid="insertMoney">
          <Button onClick={() => snackMachine.insertOneCent()}>Put ¢1</Button>
          <Button onClick={() => snackMachine.insertTenCent()}>Put ¢10</Button>
          <Button onClick={() => snackMachine.insertQuarter()}>Put ¢25</Button>
          <Button onClick={() => snackMachine.insertDollar()}>Put $1</Button>
          <Button onClick={() => snackMachine.insertFiveDollar()}>
            Put $5
          </Button>
          <Button onClick={() => snackMachine.insertTenDollar()}>
            Put $10
          </Button>
        </div>

        <div>
          <Button
            className="w-full"
            onClick={() => snackMachine.returnMoney()}
            data-testid="buttonReturnMoney"
          >
            Return money
          </Button>
        </div>

        <div className="h-6 text-center" data-testid="message">
          {message}
        </div>

        <div className="flex flex-col" data-testid="moneyInside">
          <h3 className="text-center">Money inside: {moneyInMachine}</h3>
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

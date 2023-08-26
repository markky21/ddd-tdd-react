import { Button } from "../../../common/view/atoms/button";
import { Card } from "../../../common/view/atoms/card";
import { useObservableState } from "observable-hooks";
import { SnackMachineService } from "../../service/snack-machine.service";
import { Snacks } from "../molecules/snacks";

interface SnackMachineInterfaceProps {
  snackMachineService: SnackMachineService;
}
export function SnackMachineInterface({
  snackMachineService,
}: SnackMachineInterfaceProps) {
  const moneyInserted = useObservableState(
    snackMachineService.moneyInserted$,
    ""
  );
  const message = useObservableState(snackMachineService.message$, "");
  const coinsAndNotes = useObservableState(
    snackMachineService.coinsAndNotes$,
    null
  );
  const moneyInMachine = useObservableState(
    snackMachineService.moneyInMachine$,
    null
  );
  const slots = useObservableState(snackMachineService.snacks$, []);

  return (
    <Card className="max-w-xl">
      <h2 className="text-2xl p-4">Snack Machine</h2>
      <hr className="mb-4" />
      <div className="flex flex-col justify-center gap-6">
        <div className="flex gap-4">
          <Snacks slots={slots} />

          <div>
            <Button
              className="w-full"
              onClick={() => snackMachineService.buySnack(0)}
              data-testid="buttonBuySnack0"
            >
              Buy a snack 1
            </Button>
            <Button
              className="w-full"
              onClick={() => snackMachineService.buySnack(1)}
              data-testid="buttonBuySnack1"
            >
              Buy a snack 2
            </Button>
            <Button
              className="w-full"
              onClick={() => snackMachineService.buySnack(2)}
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
          <Button onClick={() => snackMachineService.insertOneCent()}>
            Put ¢1
          </Button>
          <Button onClick={() => snackMachineService.insertTenCent()}>
            Put ¢10
          </Button>
          <Button onClick={() => snackMachineService.insertQuarter()}>
            Put ¢25
          </Button>
          <Button onClick={() => snackMachineService.insertDollar()}>
            Put $1
          </Button>
          <Button onClick={() => snackMachineService.insertFiveDollar()}>
            Put $5
          </Button>
          <Button onClick={() => snackMachineService.insertTenDollar()}>
            Put $10
          </Button>
        </div>

        <div>
          <Button
            className="w-full"
            onClick={() => snackMachineService.returnMoney()}
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

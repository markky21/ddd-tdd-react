import { TakeMoneyForm } from "../molecules/take-money-form";
import { Card } from "../../../common/view/atoms/card";
import { AtmService } from "../../service/atm.service";
import { Cash } from "../../../shared-kernel/value-objects/cash";
import { useObservableState } from "observable-hooks";

interface AtmProps {
  atmService: AtmService;
}
export const Atm = ({ atmService }: AtmProps) => {
  const message = useObservableState(atmService.message$, "");
  const coinsAndNotes = useObservableState(atmService.moneyInside$, null);

  const onSubmit = (amount: number) => {
    atmService.takeMoney(new Cash(amount));
  };

  return (
    <Card className="max-w-xl">
      <div className="flex flex-col">
        <h2 className="text-2xl p-4">ATM</h2>
        <hr className="mb-4" />
        <TakeMoneyForm onSubmit={onSubmit} />
      </div>
      <div>{message}</div>
      <div className="flex flex-col" data-testid="moneyInside">
        <div>¢1: {coinsAndNotes?.oneCentCount}</div>
        <div>¢10: {coinsAndNotes?.tenCentCount}</div>
        <div>¢25: {coinsAndNotes?.quarterCentCount}</div>
        <div>$1: {coinsAndNotes?.oneDollarCount}</div>
        <div>$5: {coinsAndNotes?.fiveDollarCount}</div>
        <div>$10: {coinsAndNotes?.tenDollarCount}</div>
      </div>
    </Card>
  );
};

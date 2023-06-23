import { Money } from "../../../shared-kernel/value-objects/money";
import { Cash } from "../../../shared-kernel/value-objects/cash";

interface MoneyInsideProps {
  moneyInside: Money;
  moneyCharged: Cash;
}
export const MoneyInside = ({
  moneyInside,
  moneyCharged,
}: MoneyInsideProps) => {
  const coinsAndNotes = moneyInside.getCoinsAndNotes();

  return (
    <div>
      <h2>Money inside: {moneyInside.toView()}</h2>
      <h2>Money charged: {moneyCharged.toView()}</h2>
      <div data-testid="moneyInside">
        <h2>Coins and notes:</h2>
        <div>¢1: {coinsAndNotes?.oneCentCount}</div>
        <div>¢10: {coinsAndNotes?.tenCentCount}</div>
        <div>¢25: {coinsAndNotes?.quarterCentCount}</div>
        <div>$1: {coinsAndNotes?.oneDollarCount}</div>
        <div>$5: {coinsAndNotes?.fiveDollarCount}</div>
        <div>$10: {coinsAndNotes?.tenDollarCount}</div>
      </div>
    </div>
  );
};

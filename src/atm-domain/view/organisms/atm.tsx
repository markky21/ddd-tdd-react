import { TakeMoneyForm } from "../molecules/take-money-form";
import { Card } from "../../../common/view/atoms/card";

export const Atm = () => {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const onSubmit = (amount: number) => {
    // eslint-disable-next-line no-console
    console.log({ amount });
  };

  return (
    <Card className="max-w-xl">
      <h2 className="text-2xl p-4">ATM</h2>
      <hr className="mb-4" />
      <TakeMoneyForm onSubmit={onSubmit} />
    </Card>
  );
};

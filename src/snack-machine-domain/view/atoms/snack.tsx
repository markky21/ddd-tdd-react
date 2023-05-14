interface SnackProps {
  name: string;
  price: string;
  quantity: number;
}
export const Snack = ({ name, price, quantity }: SnackProps) => {
  return (
    <article className="p-2 flex flex-col gap-2 rounded shadow-md w-full">
      <h3 className="font-bold" data-testid="snackName">
        {name}
      </h3>

      <div className="flex gap-2 justify-between">
        <span>Price:</span>
        <span className="font-bold" data-testid="snackPrice">
          {price}
        </span>
      </div>
      <div className="flex gap-2 justify-between">
        <span>Quantity:</span>
        <span className="font-bold" data-testid="snackAmount">
          {quantity}
        </span>
      </div>
    </article>
  );
};

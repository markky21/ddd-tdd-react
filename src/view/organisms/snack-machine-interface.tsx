import { Button } from "../atoms/button";
import { Card } from "../atoms/card";

export function SnackMachineInterface() {
  return (
    <Card className="max-w-md">
      <div className="flex flex-col justify-center gap-6">
        <div>
          <Button className="w-full">Buy a snack</Button>
        </div>

        <h3 className="text-center">Money inserted: </h3>

        <div className="grid grid-cols-3 gap-3">
          <Button>Put ¢1</Button>
          <Button>Put ¢10</Button>
          <Button>Put ¢25</Button>
          <Button>Put $1</Button>
          <Button>Put $5</Button>
          <Button>Put $10</Button>
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

import { Card } from "../../../common/view/atoms/card";
import { SnackMachines } from "../organisms/snack-machines";
import { Atms } from "../organisms/atms";

export interface HeadOfficeProps {}

export const HeadOffice = () =>
  // {}: HeadOfficeProps
  {
    const message = "";

    return (
      <Card className="w-full">
        <div className="flex flex-col mb-4">
          <h2 className="text-2xl p-4">Head Office</h2>
          <hr className="mb-4" />
          <div>
            <div>Balance:</div>
            <div>Cache:</div>
          </div>
          <div>{message}</div>
        </div>
        <div className="flex gap-4">
          <SnackMachines onShow={() => null} onUnloadCash={() => null} />
          <Atms onShow={() => null} onLoadCash={() => null} />
        </div>
      </Card>
    );
  };

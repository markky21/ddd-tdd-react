import { useCallback, useRef, useState } from "react";
import { SnackMachinesService } from "../../service/snack-machines.service";
import { TableContent } from "../molecules/table-content";
import { useObservableState } from "observable-hooks";
import { Button } from "../../../common/view/atoms/button";
import { EntityId } from "../../../common/entities/entity.abstract";

export interface SnackMachinesProps {
  onShow: (id: EntityId) => void;
  onUnloadCash: (id: EntityId) => void;
}

export const SnackMachines = ({ onShow, onUnloadCash }: SnackMachinesProps) => {
  const [selected, useSelected] = useState<EntityId | null>(null);
  const snackMachineServiceRef = useRef(new SnackMachinesService());
  const service = snackMachineServiceRef.current;
  const snackMachinesDto = useObservableState(service.allSnackMachines$);

  const onRowSelected = useCallback((tr: (string | number)[] | null) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useSelected((tr?.[0] as EntityId) ?? null);
  }, []);

  const onShowClick = useCallback(() => {
    selected && onShow(selected);
  }, [onShow, selected]);

  const onUnloadCashClick = useCallback(() => {
    selected && onUnloadCash(selected);
  }, [onUnloadCash, selected]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <h3>Snack machines:</h3>

      <div className="flex gap-2">
        <Button disabled={!selected} onClick={onShowClick}>
          Show
        </Button>

        <Button disabled={!selected} onClick={onUnloadCashClick}>
          Unload cash
        </Button>
      </div>

      <TableContent
        th={["id", "money in machine"]}
        tr={snackMachinesDto?.map((sm) => [sm.id, sm.moneyInMachine]) ?? []}
        onRowSelected={onRowSelected}
      />
    </div>
  );
};

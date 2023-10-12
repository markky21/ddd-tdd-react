import { useCallback, useRef, useState } from "react";
import { TableContent } from "../molecules/table-content";
import { useObservableState } from "observable-hooks";
import { Button } from "../../../common/view/atoms/button";
import { EntityId } from "../../../common/entities/entity.abstract";
import { AtmsService } from "../../service/atms.service";

export interface AtmsProps {
  onShow: (id: EntityId) => void;
  onLoadCash: (id: EntityId) => void;
}

export const Atms = ({ onShow, onLoadCash }: AtmsProps) => {
  const [selected, useSelected] = useState<EntityId | null>(null);
  const atmsServiceRef = useRef(new AtmsService());
  const service = atmsServiceRef.current;
  const AtmDtos = useObservableState(service.allSnackMachines$);

  const onRowSelected = useCallback((tr: (string | number)[] | null) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useSelected((tr?.[0] as EntityId) ?? null);
  }, []);

  const onShowClick = useCallback(() => {
    selected && onShow(selected);
  }, [onShow, selected]);

  const onLoadCashClick = useCallback(() => {
    selected && onLoadCash(selected);
  }, [onLoadCash, selected]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <h3>Atms:</h3>

      <div className="flex gap-2">
        <Button disabled={!selected} onClick={onShowClick}>
          Show
        </Button>

        <Button disabled={!selected} onClick={onLoadCashClick}>
          Load cash
        </Button>
      </div>

      <TableContent
        th={["id", "cash"]}
        tr={AtmDtos?.map((atm) => [atm.id, atm.moneyInside]) ?? []}
        onRowSelected={onRowSelected}
      />
    </div>
  );
};

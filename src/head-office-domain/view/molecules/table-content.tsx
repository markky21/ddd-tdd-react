import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useOnClickOutside } from "usehooks-ts";

export interface TableContentProps {
  th: (string | number)[];
  tr: (string | number)[][];
  onRowSelected: (row: (string | number)[] | null) => void;
}

export const TableContent = ({ th, tr, onRowSelected }: TableContentProps) => {
  const ref = useRef<HTMLTableRowElement>(null);
  const [selected, setSelected] = useState<null | number>(null);

  useOnClickOutside(ref, () => {
    onRowSelected(null);
    setSelected(null);
  });

  return (
    <table className="table-auto text-left border w-full">
      <thead>
        <tr>
          {th.map((t, index) => (
            <th key={index} className="p-2 border">
              {t}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tr.map((tr, index) => (
          <tr
            ref={ref}
            key={index}
            onClick={() => {
              onRowSelected(tr);
              setSelected(index);
            }}
            className={twMerge(
              "cursor-pointer",
              selected === index && "bg-blue-100"
            )}
          >
            {tr.map((td, i) => (
              <td key={i} className="p-2 border">
                {td}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

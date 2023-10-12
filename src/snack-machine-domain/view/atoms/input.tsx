import React from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }: InputProps, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={twMerge(
          "py-2 px-4 border-2 border-b-4 border-blue-700 hover:border-blue-500 rounded",
          className
        )}
      />
    );
  }
);

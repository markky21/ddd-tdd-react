import React from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../common/view/atoms/button";
import { Input } from "../../../snack-machine-domain/view/atoms/input";

const formSchema = z.object({
  amount: z.coerce.number().min(0.01, "Amount is required").step(0.01),
});
type FormSchemaType = z.infer<typeof formSchema>;

interface NumberFormProps {
  onSubmit: (number: number) => void;
}
export const TakeMoneyForm = ({ onSubmit }: NumberFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const onSubmitForm: SubmitHandler<FormSchemaType> = ({ amount }) => {
    onSubmit(amount);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitForm)}
      name="takeMoneyForm"
      className="p-4 flex gap-4"
    >
      <label className="flex gap-2 items-center">
        <span className="font-bold">Amount to take:</span>
        <Input
          id="amount"
          required
          min={0.01}
          step={0.01}
          type="number"
          {...register("amount")}
        />
      </label>

      <Button disabled={isSubmitting} type="submit">
        Take money
      </Button>

      {errors.amount && (
        <span className="text-red-800 block mt-2">
          {errors.amount?.message}
        </span>
      )}
    </form>
  );
};

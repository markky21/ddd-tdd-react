import { twMerge } from "tailwind-merge";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}
export const Card = ({ children, className }: CardProps) => {
  return (
    <section
      className={twMerge(
        "bg-white rounded-lg overflow-hidden shadow-lg p-4",
        className
      )}
    >
      {children}
    </section>
  );
};

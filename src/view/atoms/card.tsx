import classNames from "classnames";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}
export const Card = ({ children, className }: CardProps) => {
  return (
    <section
      className={classNames("rounded overflow-hidden shadow-lg p-4", className)}
    >
      {children}
    </section>
  );
};

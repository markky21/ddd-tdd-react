import classnames from "classnames";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}
export const Button = ({ children, className, onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={classnames(
        "bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded",
        className
      )}
    >
      {children}
    </button>
  );
};

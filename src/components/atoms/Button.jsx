import classNames from 'classnames';

export const Button = ({ children, className, color, type, ...rest }) => {
  return (
    <button
      className={classNames("min-h-[48px] p-4 min-w-[60px] text-black flex items-center justify-center rounded", className, {
        "bg-white text-black": color === "white",
        "w-20 h-20": type === "box",
      })}
      {...rest}>
      {children}
    </button>
  );
};
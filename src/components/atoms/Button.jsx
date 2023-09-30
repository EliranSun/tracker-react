import classNames from 'classnames';

export const Button = ({ children, className, color, type, ...rest }) => {
  return (
    <button
      className={classNames("p-4 text-black flex items-center justify-center rounded", className, {
        "bg-white text-black": color === "white",
        "w-20 h-20": type === "box",
      })}
      {...rest}>
      {children}
    </button>
  );
};
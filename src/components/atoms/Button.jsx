import classNames from 'classnames';

export const Button = ({ children, className, ...rest }) => {
  return (
    <button
      className={classNames("min-h-[48px] p-4 min-w-[60px] bg-white text-black", className)}
      {...rest}>
      {children}
    </button>
  );
};
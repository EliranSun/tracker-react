export const Fieldset = ({ children, legend }) => {
  return (
    <fieldset>
      <legend>{legend}</legend>
      {children}
    </fieldset>
  );
};

export const Fieldset = ({ children, legend }) => {
  return (
    <fieldset className="my-4">
      <legend className="text-lg">{legend}</legend>
      {children}
    </fieldset>
  );
};

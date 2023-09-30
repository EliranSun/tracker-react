export const Fieldset = ({ children, legend }) => {
  return (
    <fieldset className="w-full border border-white rounded-2xl box-border my-4 p-4">
      <legend className="px-2">{legend}</legend>
      {children}
    </fieldset>
  );
};

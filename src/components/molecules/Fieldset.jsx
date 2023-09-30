export const Fieldset = ({ children, legend }) => {
  return (
    <fieldset className="border border-white rounded-2xl my-y p-4">
      {/*<legend className="text-lg">{legend}</legend>*/}
      {children}
    </fieldset>
  );
};

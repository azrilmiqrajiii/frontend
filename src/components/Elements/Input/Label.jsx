const Label = ({ htmlFor, title }) => {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-left font-semibold text-[#0A2540]"
    >
      {title}
    </label>
  );
};
export default Label;

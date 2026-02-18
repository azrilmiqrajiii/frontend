const Label = ({ htmlFor, title }) => {
  return (
    <label
      htmlFor={htmlFor}
      className="block mb-2 text-sm font-semibold tracking-wide text-[#0A2540]"
    >
      {title}
    </label>
  );
};

export default Label;

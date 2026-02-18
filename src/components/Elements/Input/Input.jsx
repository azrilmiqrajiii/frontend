const Input = ({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  disabled = false,
  error = false,
}) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-4 py-3 text-sm text-slate-700 bg-white
                  border rounded-xl shadow-sm
                  transition duration-200 ease-in-out
                  focus:outline-none focus:ring-2 focus:ring-[#1E6F9F]/40 focus:border-[#1E6F9F]
                  ${error ? "border-red-400 focus:ring-red-400/40 focus:border-red-500" : "border-slate-300"}
                  ${disabled ? "bg-slate-100 cursor-not-allowed opacity-70" : ""}`}
    />
  );
};

export default Input;

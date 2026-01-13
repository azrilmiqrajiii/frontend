const Input = ({ type, name, placeholder, value, onChange }) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 border text-slate-500 border-gray-300 rounded-lg focus:ring focus:ring-[#1E6F9F] focus:outline-none mb-2"
    />
  );
};

export default Input;

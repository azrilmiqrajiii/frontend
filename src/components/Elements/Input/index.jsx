import Input from "./Input";
import Label from "./Label";

const InputForm = ({
  htmlFor,
  title,
  type,
  name,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className="space-y-1">
      <Label htmlFor={htmlFor} title={title} />
      <Input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InputForm;

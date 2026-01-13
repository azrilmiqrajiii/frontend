const Button = ({
  children,
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        
        bg-[#1E6F9F] hover:bg-[#0F3D62]
        text-white py-2 rounded-lg px-2
        font-semibold transition
        cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {loading ? "Memproses..." : children}
    </button>
  );
};

export default Button;

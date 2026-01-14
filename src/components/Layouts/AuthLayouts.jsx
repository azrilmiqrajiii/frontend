import logo from "/images/logo.png";

const AuthLayouts = ({ children, title }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0A2540] via-[#123B6D] to-[#1E4F91] px-4">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
        <div className="flex justify-center mb-4">
          <img
            src={logo}
            alt="Poltekpar Lombok"
            className="h-12 sm:h-16 object-contain"
          />
        </div>

        <h1 className="text-center text-2xl sm:text-3xl font-bold text-[#0A2540] mb-1">
          {title}
        </h1>

        <p className="text-center text-slate-500 text-sm sm:text-base mb-6">
          Sistem Penjaminan Mutu – Poltekpar Lombok
        </p>

        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayouts;

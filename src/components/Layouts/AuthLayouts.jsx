import logo from "/images/logo.png";

const AuthLayouts = ({ children, title }) => {
  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center px-4 overflow-hidden
                    bg-linear-to-br from-[#0A2540] via-[#123B6D] to-[#1E4F91]"
    >
      <div
        className="pointer-events-none absolute inset-0
                      bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.25),transparent)]
                      animate-[aurora_12s_linear_infinite] opacity-40"
      />

      <div
        className="pointer-events-none absolute inset-0
                      bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_45%)]"
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]
                      bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IndoaXRlIi8+PC9zdmc+')]"
      />

      <div
        className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg
                      bg-white/95 backdrop-blur rounded-md shadow-2xl
                      p-6 sm:p-8 lg:p-10"
      >
        <div className="flex justify-center mb-4">
          <  
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

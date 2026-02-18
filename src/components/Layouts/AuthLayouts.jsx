import logo from "/images/logo.png"

const AuthLayouts = ({ children, title }) => {
  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center px-4 overflow-hidden
                 bg-linear-to-br from-[#081C33] via-[#0F2F55] to-[#123B6D]"
    >
      <div
        className="absolute inset-0 pointer-events-none
                   bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_50%)]"
      />

      <div
        className="absolute inset-0 pointer-events-none
                   bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_50%)]"
      />

      <div
        className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg
                   bg-white/95 backdrop-blur-xl
                   rounded-2xl border border-white/30
                   shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                   p-8 sm:p-10"
      >
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Poltekpar Lombok"
            className="h-14 sm:h-16 object-contain"
          />
        </div>

        <h1 className="text-center text-2xl sm:text-3xl font-semibold tracking-tight text-[#0A2540]">
          {title}
        </h1>

        <p className="text-center text-slate-500 text-sm sm:text-base mt-2 mb-8">
          Sistem Penjaminan Mutu – Poltekpar Lombok
        </p>

        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayouts

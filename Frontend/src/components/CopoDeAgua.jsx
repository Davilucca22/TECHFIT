
export default function WaterGlass({ consumido = 0, meta = 2500 }) {
  const progresso = Math.min((consumido / meta) * 100, 100);

  return (
    <div className="flex flex-col items-center gap-4">

      <div className="relative h-48 w-32 overflow-hidden rounded-b-[30px] rounded-t-xl border-4 border-white/30 bg-white/5 backdrop-blur">

        {/* Água */}
        <div
          className="absolute bottom-0 left-0 w-full bg-gradient-to-b from-sky-300 via-sky-500 to-blue-700 transition-all duration-1000 ease-out"
          style={{ height: `${progresso}%` }}
        >
          {/* Ondas */}
          <div className="wave wave-one" />
          <div className="wave wave-two" />
        </div>

        {/* Percentual */}
        <span className="absolute inset-0 z-10 flex items-center justify-center text-2xl font-bold text-white drop-shadow-lg">
          {Math.round(progresso)}%
        </span>

      </div>

      <div className="flex flex-col items-center text-white">
        <strong className="text-xl">{consumido} ml</strong>
        <span className="text-sm text-white/50">
          Meta: {meta} ml
        </span>
      </div>

    </div>
  );
}

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-20 relative">
      {/* Main circular design */}
      <div className="relative">
        {/* Outer circle */}
        <div className="w-80 h-80 md:w-96 md:h-96 border-4 border-ocean-blue rounded-full flex items-center justify-center mb-8">
          {/* Inner content */}
          <div className="text-center">
            <p className="text-sm text-ocean-blue font-light tracking-[0.3em] uppercase mb-2">
              08.11.2025
            </p>
            <h1 className="text-4xl md:text-5xl font-handwritten text-ocean-blue mb-2 leading-tight">
              JUANCA
              <br />
              &<br />
              NURIA
            </h1>
            <p className="text-sm text-ocean-blue font-light tracking-[0.2em] uppercase">
              Estancia Lupita
            </p>
          </div>
        </div>
      </div>

      {/* Subtitle */}
      <p className="text-lg md:text-xl text-soft-gray font-light tracking-wide max-w-md">
        Te invitamos a nuestro casamiento
      </p>
    </section>
  );
}

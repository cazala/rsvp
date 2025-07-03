"use client";

export default function Itinerary() {
  const schedule = [
    { time: "18:30", activity: "Recepción, juegos, catering" },
    { time: "20:30", activity: "Tanda de baile (música pop)" },
    { time: "22:45", activity: "Brindis y mesa dulce" },
    { time: "23:30", activity: "DJs (música electrónica)" },
    { time: "04:30", activity: "Fin de fiesta" },
  ];

  return (
    <section className="py-16 relative">
      <div className="bg-white/80 backdrop-blur-sm border-2 border-ocean-blue rounded-3xl p-8 px-4 md:p-12">
        <div className="text-center mb-12">
          <p className="text-sm text-ocean-blue font-light tracking-[0.2em] uppercase mb-2">
            Horarios
          </p>
          <h2 className="text-3xl md:text-4xl font-handwritten text-ocean-blue mb-4">
            Itinerario
          </h2>
          <p className="text-lg text-soft-gray font-light">
            El cronograma de la fiesta
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-ocean-blue h-full"></div>

          {/* Timeline items */}
          <div className="space-y-12">
            {schedule.map((item, index) => {
              const isLeft = index % 2 === 0;

              return (
                <div key={index} className="relative flex items-center">
                  {/* Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-ocean-blue rounded-full border-4 border-white shadow-lg z-10"></div>

                  {/* Content */}
                  <div
                    className={`w-1/2 ${
                      isLeft ? "pr-4 text-right" : "pl-4 ml-auto text-left"
                    }`}
                  >
                    <div className={`${isLeft ? "mr-4" : "ml-4"}`}>
                      <div className="text-2xl font-bold text-ocean-blue mb-2">
                        {item.time}
                      </div>
                      <div className="text-soft-gray font-light text-lg">
                        {item.activity}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

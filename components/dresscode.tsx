export default function Dresscode() {
  return (
    <section className="py-16 flex flex-col items-center text-center relative">
      <div className="bg-white/80 backdrop-blur-sm border-2 border-ocean-blue rounded-3xl p-8 md:p-12 max-w-lg w-full">
        <p className="text-sm text-ocean-blue font-light tracking-[0.2em] uppercase mb-2">Dress Code</p>
        <h2 className="text-3xl md:text-4xl font-handwritten text-ocean-blue mb-8">Elegante Sport</h2>

        <div className="flex justify-center space-x-12 mb-6">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-2 border-ocean-blue rounded-full mb-3 flex items-center justify-center text-xl bg-white">
              👔
            </div>
            <span className="text-sm text-soft-gray font-light">Para Él</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-2 border-ocean-blue rounded-full mb-3 flex items-center justify-center text-xl bg-white">
              👗
            </div>
            <span className="text-sm text-soft-gray font-light">Para Ella</span>
          </div>
        </div>

        <p className="text-soft-gray font-light leading-relaxed text-sm">
          Vestimenta elegante pero cómoda. Traje o saco con pantalón de vestir para ellos, vestido de cocktail o
          conjunto elegante para ellas.
        </p>
      </div>
    </section>
  )
}

export default function Dresscode() {
  return (
    <section className="py-16 flex flex-col items-center text-center relative">
      <div className="bg-white/80 backdrop-blur-sm border-2 border-ocean-blue rounded-3xl p-8 md:p-12 max-w-lg w-full">
        <p className="text-sm text-ocean-blue font-light tracking-[0.2em] uppercase mb-2">
          Dress Code
        </p>
        <h2 className="text-3xl md:text-4xl font-handwritten text-ocean-blue mb-8">
          Elegante Sport
        </h2>

        <p className="text-soft-gray font-light leading-relaxed text-sm">
          Vestimenta elegante pero cómoda. La recepcion es afuera sobre cesped
          asi que ojo con los tacos.
        </p>
      </div>
    </section>
  );
}

export default function Dresscode() {
  return (
    <section className="py-16 flex flex-col items-center text-center relative">
      <div className="bg-white/80 backdrop-blur-sm border-2 border-primary rounded-3xl p-8 md:p-12 max-w-lg w-full">
        <p className="text-sm text-primary font-light tracking-[0.2em] uppercase mb-2">
          Dress Code
        </p>
        <h2 className="text-3xl md:text-4xl font-handwritten text-primary mb-8">
          Formal
        </h2>

        <p className="text-soft-gray font-light leading-relaxed text-md">
          Vestimenta formal pero cómoda. Podés venir en camisa sin saco, o en
          vestido corto. Y si queres venir elegante, todo lo que quieras. Tener
          en cuenta que la recepcion es afuera sobre cesped.
        </p>
      </div>
    </section>
  );
}

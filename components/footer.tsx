import { WEDDING_CONFIG } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="md:py-16 py-32 pb-16 text-center relative">
      <div className="bg-white/80 backdrop-blur-sm border-2 border-primary rounded-3xl p-8 max-w-lg mx-auto">
        <p className="text-sm text-soft-gray font-light tracking-wide">
          Ante cualquier duda pueden comunicarse con{" "}
          <a
            className="font-bold text-primary cursor-pointer underline"
            href="https://wa.me/5491124820110
"
            target="_blank"
            style={{ textDecoration: "underline!important" }}
          >
            Natasha
          </a>{" "}
          o{" "}
          <a
            className="font-bold text-primary cursor-pointer underline"
            href="https://wa.me/5491120496608
"
            target="_blank"
            style={{ textDecoration: "underline!important" }}
          >
            Abril
          </a>
          , las organizadoras del evento.
        </p>
        <div className="w-16 h-px bg-primary mx-auto mt-6 mb-6"></div>
        <p className="text-sm text-soft-gray font-light tracking-wide">
          {WEDDING_CONFIG.couple.name1} & {WEDDING_CONFIG.couple.name2} • Sábado
          8 de Noviembre
        </p>
      </div>
    </footer>
  );
}

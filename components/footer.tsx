import { WEDDING_CONFIG, getFormattedWeddingDate } from "@/lib/config";

export default function Footer() {
  const formattedDate = getFormattedWeddingDate();

  return (
    <footer className="md:py-16 py-32 pb-16 text-center relative">
      <div className="bg-white/80 backdrop-blur-sm border-2 border-ocean-blue rounded-3xl p-8 max-w-lg mx-auto">
        <div className="w-16 h-px bg-ocean-blue mx-auto mb-6"></div>
        <p className="text-sm text-soft-gray font-light tracking-wide">
          {WEDDING_CONFIG.couple.name1} & {WEDDING_CONFIG.couple.name2} •{" "}
          {formattedDate}
        </p>
      </div>
    </footer>
  );
}

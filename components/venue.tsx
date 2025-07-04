"use client";

import { Navigation } from "lucide-react";

export default function Venue() {
  return (
    <section className="py-16 relative">
      <div className="bg-white/80 backdrop-blur-sm border-2 border-ocean-blue rounded-3xl p-8 md:p-12">
        <div className="text-center mb-10">
          <p className="text-sm text-ocean-blue font-light tracking-[0.2em] uppercase mb-2">
            Venue
          </p>
          <h2 className="text-3xl md:text-4xl font-handwritten text-ocean-blue mb-4">
            Estancia Lupita
          </h2>
          <p className="text-lg text-soft-gray font-light mb-6">
            Del Viso, Buenos Aires
          </p>

          {/* <a
            href="https://maps.app.goo.gl/wdKEnfEndLM1GVc89"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3 bg-ocean-blue text-white hover:bg-sky-blue transition-colors font-light tracking-wide rounded-full"
          >
            <MapPin className="mr-2 h-4 w-4" />
            Ver Ubicación
          </a> */}
        </div>

        <div className="aspect-video w-full mb-6 overflow-hidden rounded-2xl border-2 border-ocean-blue">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1644.9652941471286!2d-58.814839769516844!3d-34.45390983079109!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bc9fae3878d357%3A0xa5ee6ab1b1e131d6!2sEstancia%20Lupita!5e0!3m2!1sen!2sar!4v1751640774140!5m2!1sen!2sar"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <div className="space-y-4 text-center">
          <h3 className="text-xl font-handwritten text-ocean-blue">
            Ubicación
          </h3>
          <p className="text-[#6d5c50] font-light leading-relaxed max-w-2xl mx-auto mb-4">
            Estancia Lupita está ubicada en{" "}
            <b className="font-bold">Viamonte 2298, Del Viso</b>. Es a unos
            30-45 minutos de Capital.
          </p>

          <h3 className="text-xl font-handwritten text-ocean-blue">Traslado</h3>
          <p className="text-[#6d5c50] font-light leading-relaxed max-w-2xl mx-auto mb-4">
            Va a haber un traslado saliendo desde{" "}
            <b className="font-bold">Plaza Italia</b>, podes indicar en el
            formulario de confirmacion si querés usar el servicio.
          </p>

          <h3 className="text-xl font-handwritten text-ocean-blue">
            Voy en auto
          </h3>
          <p className="text-[#6d5c50] font-light leading-relaxed max-w-2xl mx-auto">
            Si vas en auto, lo más directo es tomar{" "}
            <b className="font-bold">
              Panamericana ramal Pilar y bajarse en Chile
            </b>
            . El GPS capaz te diga de bajar antes, porque es más corto en
            distancia, pero te hace atravesar todo Del Viso. Es mejor seguir un
            poco más, bajarse de Panamericana por Chile y llegas directo. Acá
            tenés un link con las indicaciones de cómo llegar en auto.
          </p>

          <div className="pt-4">
            <a
              href="https://maps.app.goo.gl/FhDVMJoVtAp25Psv7?g_st=ic"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 border-2 border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white transition-colors font-light tracking-wide rounded-full"
            >
              <Navigation className="mr-2 h-4 w-4" />
              Ver Indicaciones
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

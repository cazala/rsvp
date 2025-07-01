"use client"

import { MapPin, Navigation } from "lucide-react"

export default function Venue() {
  return (
    <section className="py-16 relative">
      <div className="bg-white/80 backdrop-blur-sm border-2 border-ocean-blue rounded-3xl p-8 md:p-12">
        <div className="text-center mb-10">
          <p className="text-sm text-ocean-blue font-light tracking-[0.2em] uppercase mb-2">Venue</p>
          <h2 className="text-3xl md:text-4xl font-handwritten text-ocean-blue mb-4">Estancia La Lupita</h2>
          <p className="text-lg text-soft-gray font-light mb-6">Del Viso, Buenos Aires</p>

          <a
            href="https://maps.app.goo.gl/wdKEnfEndLM1GVc89"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3 bg-ocean-blue text-white hover:bg-sky-blue transition-colors font-light tracking-wide rounded-full"
          >
            <MapPin className="mr-2 h-4 w-4" />
            Ver Ubicación
          </a>
        </div>

        <div className="aspect-video w-full mb-6 overflow-hidden rounded-2xl border-2 border-ocean-blue">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3290.0115759533247!2d-58.79845932345247!3d-34.44954997307249!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bc9f2b82b1c9c9%3A0x8c4d79c3f3a2a2a5!2sGral.+Viamonte+2298%2C+B1669+Del+Viso%2C+Provincia+de+Buenos+Aires!5e0!3m2!1sen!2sar!4v1715530750000!5m2!1sen!2sar"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Estancia La Lupita Map"
            className="w-full h-full"
          ></iframe>
        </div>

        <div className="space-y-4 text-center">
          <h3 className="text-xl font-handwritten text-ocean-blue">Cómo llegar</h3>
          <p className="text-[#6d5c50] font-light leading-relaxed max-w-2xl mx-auto mb-4">
            Estancia La Lupita está ubicada en Gral. Viamonte 2298, B1669 Del Viso, Provincia de Buenos Aires,
            Argentina. El lugar se encuentra aproximadamente a 45 minutos del centro de Buenos Aires.
          </p>

          <p className="text-[#6d5c50] font-light leading-relaxed max-w-2xl mx-auto mb-4">
            Va a haber un traslado desde Capital, podes indicar en el formulario de confirmacion si querés usar el servicio.
          </p>

          <p className="text-[#6d5c50] font-light leading-relaxed max-w-2xl mx-auto">
            Si vas en auto, lo más directo es tomar Panamericana ramal Pilar y bajarse en Chile. El GPS capaz te diga de
            bajar antes, porque es más corto en distancia, pero te hace atravesar todo Del Viso. Es mejor seguir un poco
            más, bajarse de Panamericana por Chile y llegas directo. Acá tenés un link con las indicaciones de cómo
            llegar en auto.
          </p>

          <div className="pt-4">
            <a
              href="https://maps.app.goo.gl/r6qtgTfT874Kxta78"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-2 border-2 border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white transition-colors font-light text-sm tracking-wide rounded-full"
            >
              <Navigation className="mr-2 h-4 w-4" />
              Obtener Indicaciones
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

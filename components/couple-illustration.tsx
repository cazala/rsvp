export function CoupleIllustration() {
  return (
    <div className="w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
      <svg viewBox="0 0 300 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Simple line art couple silhouette */}
        <g stroke="#c4969a" strokeWidth="2" fill="none">
          {/* Woman's silhouette */}
          <path d="M120 80 C115 75, 125 70, 130 75 C135 70, 145 75, 140 80 C145 85, 140 90, 135 85 C130 90, 120 85, 120 80 Z" />
          <path d="M130 85 L130 120" />
          <path d="M115 100 L145 100" />
          <path d="M130 120 L120 160" />
          <path d="M130 120 L140 160" />
          <path d="M120 160 L115 180" />
          <path d="M140 160 L145 180" />

          {/* Man's silhouette */}
          <path d="M170 75 C165 70, 175 65, 180 70 C185 65, 195 70, 190 75 C195 80, 190 85, 185 80 C180 85, 170 80, 170 75 Z" />
          <path d="M180 80 L180 125" />
          <path d="M165 105 L195 105" />
          <path d="M180 125 L170 165" />
          <path d="M180 125 L190 165" />
          <path d="M170 165 L165 185" />
          <path d="M190 165 L195 185" />

          {/* Holding hands */}
          <path d="M145 100 L165 105" strokeWidth="3" />

          {/* Small decorative flowers */}
          <circle cx="100" cy="200" r="3" fill="#c4969a" />
          <circle cx="220" cy="190" r="3" fill="#c4969a" />
          <circle cx="110" cy="220" r="2" fill="#c4969a" />
          <circle cx="210" cy="210" r="2" fill="#c4969a" />
        </g>
      </svg>
    </div>
  )
}

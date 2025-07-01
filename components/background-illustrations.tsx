export function BackgroundIllustrations() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Top left - Two cats sitting together (single line) */}
      <div className="absolute top-12 left-8 opacity-15">
        <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Left cat - continuous single line */}
          <path
            d="M20 40 L25 30 L30 35 L35 30 L40 40 Q45 45, 45 55 Q45 70, 35 75 Q25 80, 15 75 Q10 70, 10 55 Q10 45, 15 40 L20 40 M25 50 L30 50 M35 50 L40 50 M27.5 55 L32.5 55 M30 60 L30 65"
            stroke="#3498db"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right cat - continuous single line */}
          <path
            d="M70 40 L75 30 L80 35 L85 30 L90 40 Q95 45, 95 55 Q95 70, 85 75 Q75 80, 65 75 Q60 70, 60 55 Q60 45, 65 40 L70 40 M75 50 L80 50 M85 50 L90 50 M77.5 55 L82.5 55 M80 60 L80 65"
            stroke="#5dade2"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Heart between cats */}
          <path
            d="M50 45 Q48 43, 46 45 Q44 47, 46 49 Q50 53, 54 49 Q56 47, 54 45 Q52 43, 50 45"
            stroke="#3498db"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Top right - Cat with crown (bride) */}
      <div className="absolute top-8 right-12 opacity-16">
        <svg width="100" height="120" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cat with crown - single continuous line */}
          <path
            d="M30 50 L35 35 L40 45 L45 35 L50 45 L55 35 L60 45 L65 35 L70 50 Q75 55, 75 70 Q75 90, 65 100 Q55 110, 45 110 Q35 110, 25 100 Q15 90, 15 70 Q15 55, 20 50 L30 50 M35 65 L40 65 M45 65 L50 65 M42.5 75 L47.5 75 M45 80 L45 85 M25 85 Q45 95, 65 85"
            stroke="#3498db"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Crown details */}
          <path
            d="M35 35 L40 25 L45 30 L50 25 L55 30 L60 25 L65 35"
            stroke="#5dade2"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Bottom left - Cat with bow tie (groom) */}
      <div className="absolute bottom-16 left-12 opacity-14">
        <svg width="110" height="100" viewBox="0 0 110 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Groom cat - single line */}
          <path
            d="M25 35 L30 25 L35 30 L40 25 L45 35 Q50 40, 50 55 Q50 75, 40 85 Q30 95, 20 85 Q10 75, 10 55 Q10 40, 15 35 L25 35 M30 50 L35 50 M40 50 L45 50 M32.5 60 L37.5 60 M35 65 L35 70"
            stroke="#3498db"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Bow tie */}
          <path
            d="M25 75 L45 75 L40 80 L45 85 L25 85 L30 80 Z M32.5 77.5 L32.5 82.5"
            stroke="#5dade2"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Top hat */}
          <path
            d="M20 25 L50 25 M25 25 L25 15 L45 15 L45 25 M22 25 Q35 22, 48 25"
            stroke="#3498db"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Bottom right - Playful cat with yarn */}
      <div className="absolute bottom-20 right-16 opacity-15">
        <svg width="100" height="90" viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Playful cat - single line */}
          <path
            d="M20 30 L25 20 L30 25 L35 20 L40 30 Q45 35, 45 50 Q45 65, 35 70 Q25 75, 15 70 Q10 65, 10 50 Q10 35, 15 30 L20 30 M25 45 L30 45 M35 45 L40 45 M27.5 55 L32.5 55 M30 60 L30 65"
            stroke="#5dade2"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Yarn ball */}
          <circle cx="70" cy="40" r="12" stroke="#3498db" strokeWidth="1.5" fill="none" />
          <path
            d="M60 35 Q70 30, 80 35 M60 40 Q70 35, 80 40 M60 45 Q70 40, 80 45"
            stroke="#3498db"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />
          {/* Yarn string */}
          <path
            d="M58 40 Q50 45, 45 50 Q40 55, 35 60"
            stroke="#3498db"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Cat paw reaching */}
          <path d="M45 55 Q50 50, 55 55" stroke="#5dade2" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* Middle left - Sleeping cat */}
      <div className="absolute top-1/2 left-4 opacity-12 transform -translate-y-1/2">
        <svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Sleeping cat - single curved line */}
          <path
            d="M15 35 L20 25 L25 30 L30 25 L35 35 Q45 40, 55 35 Q65 30, 70 35 Q75 40, 70 45 Q60 50, 45 45 Q30 40, 20 45 Q10 40, 15 35"
            stroke="#3498db"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Closed eyes */}
          <path d="M22 35 Q25 33, 28 35" stroke="#3498db" strokeWidth="1" fill="none" strokeLinecap="round" />
          <path d="M30 35 Q33 33, 36 35" stroke="#3498db" strokeWidth="1" fill="none" strokeLinecap="round" />
          {/* ZZZ */}
          <path
            d="M45 20 L50 20 L45 25 L50 25 M52 18 L55 18 L52 22 L55 22 M57 16 L59 16 L57 19 L59 19"
            stroke="#3498db"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Middle right - Cat stretching */}
      <div className="absolute top-1/3 right-8 opacity-13">
        <svg width="90" height="70" viewBox="0 0 90 70" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Stretching cat - single line */}
          <path
            d="M10 50 L15 40 L20 45 L25 40 L30 50 Q40 45, 50 50 Q60 55, 70 50 Q80 45, 85 50 Q85 55, 80 60 Q70 65, 60 60 Q50 55, 40 60 Q30 65, 20 60 Q10 55, 10 50"
            stroke="#5dade2"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Eyes */}
          <circle cx="20" cy="48" r="1" stroke="#5dade2" strokeWidth="1" fill="none" />
          <circle cx="25" cy="48" r="1" stroke="#5dade2" strokeWidth="1" fill="none" />
          {/* Tail curved up */}
          <path
            d="M80 55 Q85 45, 80 35 Q75 30, 70 35"
            stroke="#5dade2"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Scattered single-line cat elements */}
      <div className="absolute top-1/4 left-1/3 opacity-10">
        <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Simple cat face outline */}
          <path
            d="M15 25 L20 15 L25 20 L30 15 L35 25 Q40 30, 35 35 Q25 40, 15 35 Q10 30, 15 25"
            stroke="#3498db"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          <path d="M20 28 L25 28 M30 28 L35 28" stroke="#3498db" strokeWidth="1" strokeLinecap="round" />
          <path d="M27.5 32 L27.5 35" stroke="#3498db" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>

      <div className="absolute bottom-1/3 left-1/4 opacity-11">
        <svg width="70" height="50" viewBox="0 0 70 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cat silhouette walking */}
          <path
            d="M10 35 L15 25 L20 30 L25 25 L30 35 Q40 30, 50 35 Q60 40, 65 35 L65 40 Q60 45, 50 40 Q40 35, 30 40 Q20 45, 10 40 L10 35"
            stroke="#5dade2"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Legs */}
          <path
            d="M20 40 L20 45 M30 40 L30 45 M45 40 L45 45 M55 40 L55 45"
            stroke="#5dade2"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="absolute top-3/4 right-1/4 opacity-9">
        <svg width="50" height="40" viewBox="0 0 50 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cat paw print - single line */}
          <path
            d="M25 30 Q20 25, 25 20 Q30 25, 25 30 M20 15 Q18 12, 20 10 Q22 12, 20 15 M30 15 Q32 12, 30 10 Q28 12, 30 15 M25 12 Q23 9, 25 7 Q27 9, 25 12 M25 35 Q23 32, 25 30 Q27 32, 25 35"
            stroke="#3498db"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="absolute top-1/6 right-1/3 opacity-8">
        <svg width="40" height="30" viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Minimalist cat sitting */}
          <path
            d="M10 20 L15 10 L20 15 L25 10 L30 20 Q30 25, 25 25 Q15 25, 10 20"
            stroke="#5dade2"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          <path d="M17 18 L23 18" stroke="#5dade2" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>

      <div className="absolute bottom-1/4 right-1/6 opacity-10">
        <svg width="60" height="30" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cat tail curve */}
          <path
            d="M10 25 Q20 15, 30 25 Q40 35, 50 25 Q55 20, 50 15"
            stroke="#3498db"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="absolute top-2/3 left-1/6 opacity-9">
        <svg width="45" height="35" viewBox="0 0 45 35" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cat curled up */}
          <path
            d="M35 20 Q40 15, 35 10 Q30 5, 25 10 Q20 15, 15 10 Q10 5, 5 10 Q0 15, 5 20 Q10 25, 15 20 Q20 15, 25 20 Q30 25, 35 20"
            stroke="#5dade2"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="absolute top-1/8 left-1/2 opacity-7">
        <svg width="35" height="25" viewBox="0 0 35 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Simple cat ears */}
          <path
            d="M10 20 L15 10 L20 15 L25 10 L30 20"
            stroke="#3498db"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  )
}

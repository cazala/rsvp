"use client";

import { useState, useEffect, useMemo } from "react";
import CalendarButtonSimple from "./calendar-button-simple";

interface DateCountdownProps {
  date: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function DateCountdown({ date }: DateCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const targetDate = useMemo(() => new Date(date), [date]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <section className="flex flex-col items-center justify-center text-center py-16 relative">
      <div className="bg-white/80 backdrop-blur-sm border-2 border-primary rounded-3xl p-8 md:p-12 max-w-2xl w-full">
        <p className="text-sm text-primary font-light tracking-[0.2em] uppercase mb-4">
          Guardá la fecha
        </p>
        <h2 className="text-2xl md:text-3xl font-light mb-8 text-soft-gray">
          Sábado 8 de Noviembre
        </h2>

        <div className="grid grid-cols-4 gap-4 md:gap-6 mb-8">
          {[
            { label: "Días", value: timeLeft.days },
            { label: "Horas", value: timeLeft.hours },
            { label: "Minutos", value: timeLeft.minutes },
            { label: "Segundos", value: timeLeft.seconds },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <div className="md:w-18 md:h-18 flex items-center justify-center border-2 border-primary rounded-full mb-2 bg-white sm:w-[72px] sm:h-[72px] w-[64px] h-[64px]">
                <span className="text-lg md:text-2xl font-bold text-primary">
                  {item.value}
                </span>
              </div>
              <span className="text-xs md:text-sm text-soft-gray font-light">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <CalendarButtonSimple eventDate={date} />
      </div>
      {/* Music */}
      <div className="absolute left-1/2 opacity-25 w-64 h-64 -ml-32 invisible md:visible md:top-105">
        <svg
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          width="1328.000000pt"
          height="566.000000pt"
          viewBox="0 0 1328.000000 566.000000"
          preserveAspectRatio="xMidYMid meet"
          fill="currentColor"
          className="text-primary"
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <g transform="translate(0.000000,566.000000) scale(0.100000,-0.100000)">
            <path
              d="M8203 5228 c-20 -26 -22 -64 -8 -177 8 -64 15 -161 15 -216 0 -94
-30 -447 -66 -780 -13 -114 -18 -300 -23 -775 l-6 -625 -35 5 c-112 16 -236
-3 -335 -52 -150 -75 -388 -317 -470 -478 -37 -73 -66 -179 -72 -265 -23 -348
260 -617 597 -566 237 35 470 255 569 537 59 170 86 409 58 519 -13 52 -14 78
-4 175 17 166 16 1244 -1 1420 -7 74 -33 295 -59 490 -34 268 -47 405 -52 561
-4 151 -10 211 -20 223 -16 19 -74 21 -88 4z m-77 -2915 c-16 -249 -78 -411
-207 -543 -69 -70 -127 -100 -198 -100 -49 0 -57 3 -93 40 l-40 40 4 88 c6
118 39 181 187 351 59 68 188 176 230 193 132 54 125 58 117 -69z"
            />
            <path
              d="M11103 4981 c-36 -23 -35 -19 -52 -256 -6 -82 -15 -202 -20 -265 -40
-487 -50 -1448 -18 -1784 10 -104 16 -191 13 -194 -3 -3 -25 13 -50 36 -78 72
-161 102 -283 102 -97 0 -164 -15 -249 -56 -231 -113 -403 -366 -421 -619 -17
-250 124 -452 345 -496 195 -38 387 44 583 249 148 153 239 308 293 496 34
117 35 200 1 265 -13 27 -22 51 -19 54 3 3 10 252 15 553 9 559 43 1475 54
1512 3 8 21 0 52 -24 71 -55 292 -158 424 -198 150 -45 251 -63 426 -76 242
-17 463 13 618 84 30 14 57 21 60 16 3 -5 -17 -146 -45 -314 -66 -399 -93
-625 -120 -996 -13 -182 -48 -543 -58 -590 l-7 -35 -100 -6 c-110 -8 -138 -14
-215 -53 -156 -78 -275 -204 -369 -390 -64 -125 -85 -218 -79 -340 9 -157 57
-259 173 -365 150 -136 398 -139 561 -4 120 97 229 298 300 551 50 179 56 416
13 524 l-20 52 21 205 c11 114 45 359 75 546 58 363 73 477 166 1225 30 242
19 319 -54 374 -46 34 -104 27 -242 -31 -149 -63 -205 -80 -325 -98 -243 -37
-553 2 -802 101 -111 44 -249 112 -373 184 -145 84 -209 99 -272 61z m-262
-2661 c76 -21 98 -77 62 -157 -53 -116 -200 -293 -292 -353 -63 -40 -154 -63
-200 -50 -121 32 -85 255 71 442 86 104 234 152 359 118z m1809 -213 c0 -164
-89 -426 -180 -530 -51 -58 -86 -77 -139 -77 -51 0 -94 35 -117 95 -44 115 29
322 160 456 70 72 144 105 239 108 l37 1 0 -53z"
            />
            <path
              d="M4833 4679 c-87 -26 -131 -200 -78 -303 20 -38 19 -48 -11 -140 -79
-248 -107 -724 -105 -1785 l1 -663 -23 6 c-105 30 -143 36 -232 36 -334 0
-630 -238 -715 -574 -88 -348 110 -617 455 -616 113 0 206 23 310 74 195 98
366 304 419 508 8 30 22 128 32 219 16 151 16 202 5 629 -12 467 -5 987 18
1405 5 94 13 236 16 318 4 81 11 147 16 147 5 0 15 -13 23 -29 32 -61 168
-191 270 -258 192 -126 427 -388 507 -568 34 -75 32 -175 -4 -237 -26 -46 -89
-102 -170 -154 -85 -54 -103 -113 -49 -167 43 -42 124 -49 200 -17 65 28 149
116 192 199 132 263 82 663 -120 961 -54 80 -192 207 -294 270 -127 79 -224
160 -278 232 -65 86 -173 298 -194 382 -23 91 -54 127 -114 132 -25 2 -59 -1
-77 -7z m-208 -3139 c10 -17 -33 -136 -88 -245 -108 -210 -285 -338 -432 -311
-21 4 -48 18 -61 31 -62 62 1 288 109 397 75 74 180 119 307 131 80 8 159 6
165 -3z"
            />
            <path
              d="M2339 4671 c-44 -14 -70 -32 -158 -106 -186 -158 -393 -247 -643
-277 -165 -20 -335 5 -598 86 -55 17 -104 26 -138 25 -30 -2 -58 3 -64 9 -16
16 -63 15 -98 -3 -45 -24 -60 -52 -60 -120 0 -58 56 -469 85 -630 8 -44 37
-233 64 -420 28 -187 68 -448 90 -580 22 -132 47 -289 56 -350 25 -169 80
-453 125 -639 22 -92 40 -171 40 -175 0 -5 -38 -11 -84 -14 -154 -11 -264 -50
-393 -139 -158 -109 -330 -313 -382 -454 -122 -324 66 -634 384 -634 304 0
546 257 692 735 15 52 26 117 30 185 5 102 5 106 -19 135 -25 30 -25 32 -31
280 -7 266 -11 306 -101 908 -59 397 -122 774 -142 860 -9 37 -14 71 -11 74 4
3 35 -6 69 -20 101 -40 173 -50 321 -45 188 8 437 66 602 142 103 48 284 199
345 289 14 20 28 37 32 37 10 0 16 -67 23 -245 6 -151 37 -652 50 -795 15
-157 87 -768 97 -814 5 -28 24 -75 40 -104 19 -34 33 -76 38 -115 9 -79 5 -89
-32 -83 -46 7 -147 -12 -206 -39 -100 -46 -303 -213 -394 -326 -52 -64 -106
-185 -117 -262 -39 -275 159 -504 419 -484 172 13 372 154 458 323 37 73 62
193 78 383 26 302 9 573 -45 715 -13 33 -26 153 -41 381 -6 88 -26 342 -45
565 -19 223 -41 506 -50 630 -47 664 -72 911 -101 1002 -18 54 -57 92 -112
108 -41 11 -38 11 -73 1z m3 -456 c1 -58 2 -122 3 -142 0 -30 -4 -38 -20 -41
-27 -5 -43 -20 -142 -131 -104 -116 -154 -155 -255 -197 -156 -66 -282 -82
-504 -66 -186 15 -277 35 -393 86 l-96 43 -8 44 c-31 185 -57 352 -54 356 3 2
36 -12 74 -31 154 -77 410 -116 626 -96 241 23 481 107 682 239 33 22 66 40
73 40 9 1 13 -27 14 -104z m260 -2826 c-6 -189 -43 -329 -108 -414 -40 -52
-138 -122 -199 -141 -99 -31 -168 11 -181 110 -10 68 12 129 76 215 102 137
356 342 405 327 6 -2 9 -40 7 -97z m-1506 -258 c-18 -195 -130 -450 -260 -589
-78 -83 -137 -113 -221 -113 -72 0 -106 14 -154 63 -79 80 -98 182 -46 259 69
105 188 219 336 322 114 79 227 125 313 126 l39 1 -7 -69z"
            />
          </g>
        </svg>
      </div>
    </section>
  );
}

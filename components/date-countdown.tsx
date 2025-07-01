"use client"

import { useState, useEffect, useMemo } from "react"
import CalendarButtonSimple from "./calendar-button-simple"

interface DateCountdownProps {
  date: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function DateCountdown({ date }: DateCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  const targetDate = useMemo(() => new Date(date), [date])

  const formattedDate = useMemo(() => {
    const rawDate = targetDate.toLocaleDateString("es-AR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    return rawDate.charAt(0).toUpperCase() + rawDate.slice(1)
  }, [targetDate])

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <section className="flex flex-col items-center justify-center text-center py-16 relative">
      <div className="bg-white/80 backdrop-blur-sm border-2 border-ocean-blue rounded-3xl p-8 md:p-12 max-w-2xl w-full">
        <p className="text-sm text-ocean-blue font-light tracking-[0.2em] uppercase mb-4">Cuenta Regresiva</p>
        <h2 className="text-2xl md:text-3xl font-light mb-8 text-slate-500">{formattedDate}</h2>

        <div className="grid grid-cols-4 gap-4 md:gap-6 mb-8">
          {[
            { label: "Días", value: timeLeft.days },
            { label: "Horas", value: timeLeft.hours },
            { label: "Minutos", value: timeLeft.minutes },
            { label: "Segundos", value: timeLeft.seconds },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <div className="md:w-18 md:h-18 flex items-center justify-center border-2 border-ocean-blue rounded-full mb-2 bg-white w-[72px] h-[72px]">
                <span className="text-lg md:text-2xl font-bold text-ocean-blue">{item.value}</span>
              </div>
              <span className="text-xs md:text-sm text-soft-gray font-light">{item.label}</span>
            </div>
          ))}
        </div>

        <CalendarButtonSimple eventDate={date} />
      </div>
    </section>
  )
}

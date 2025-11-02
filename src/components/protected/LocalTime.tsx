'use client'

import { useEffect, useState } from 'react'

interface LocalTimeProps {
  dateString: string | Date
}

export default function LocalTime({ dateString }: LocalTimeProps) {
  const [formattedTime, setFormattedTime] = useState<string>('')

  useEffect(() => {
    if (!dateString) return
    const date = new Date(dateString)
    const formatted = date.toLocaleString(undefined, {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
    setFormattedTime(formatted)
  }, [dateString])

  // During SSR, this returns empty → avoids mismatch
  if (!formattedTime) return null

  return <span>{formattedTime}</span>
}

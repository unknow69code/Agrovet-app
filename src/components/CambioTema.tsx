// components/ThemeSwitcher.tsx
'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect solo se ejecuta en el cliente, por lo que podemos mostrar la UI de forma segura
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
    >
      {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
    </button>
  )
}
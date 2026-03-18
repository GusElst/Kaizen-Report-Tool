'use client'

import { Bell, Search } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
}

export const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-surface-50 px-6">
      <div>
        <h1 className="text-lg font-semibold text-white">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {/* Búsqueda */}
        <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-surface-100 px-3 py-1.5 text-sm text-gray-400 transition-colors hover:border-white/20 hover:text-gray-200">
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Buscar...</span>
          <kbd className="hidden rounded bg-surface-200 px-1.5 py-0.5 text-[10px] text-gray-500 sm:inline">
            ⌘K
          </kbd>
        </button>

        {/* Notificaciones */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/5 hover:text-gray-200">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-500" />
        </button>

        {/* Avatar usuario */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white">
          G
        </div>
      </div>
    </header>
  )
}

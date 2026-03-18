'use client'

import { Bell, Search, Menu } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
  onMenuClick?: () => void
}

export const Header = ({ title, subtitle, onMenuClick }: HeaderProps) => {
  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-surface-200 px-4 lg:px-6">
      <div className="flex items-center gap-3">
        {/* Botón hamburguesa — solo en mobile */}
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white/40 hover:bg-white/5 hover:text-white/70 transition-colors lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="font-heading text-lg font-bold text-white tracking-wide">{title}</h1>
          {subtitle && <p className="font-body text-xs text-white/40 mt-0.5 hidden sm:block">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Búsqueda */}
        <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-surface-100 px-3 py-1.5 text-sm text-white/40 transition-colors hover:border-white/20 hover:text-white/70 font-body">
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Buscar...</span>
          <kbd className="hidden rounded bg-surface-300 px-1.5 py-0.5 text-[10px] text-white/30 md:inline">
            ⌘K
          </kbd>
        </button>

        {/* Notificaciones */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/5 hover:text-white/70">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-500" />
        </button>

        {/* Avatar usuario */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white font-heading cursor-pointer hover:bg-brand-600 transition-colors">
          G
        </div>
      </div>
    </header>
  )
}

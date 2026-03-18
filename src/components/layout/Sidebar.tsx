'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FileText,
  Layout,
  Settings,
  ChevronRight,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/',           label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/clients',    label: 'Clientes',       icon: Users },
  { href: '/reports',    label: 'Reportes',       icon: FileText },
  { href: '/templates',  label: 'Plantillas',     icon: Layout },
  { href: '/settings',   label: 'Configuración',  icon: Settings },
]

// Logo montaña geométrica basado en el brand Kaizen
const KaizenLogoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Montaña izquierda */}
    <polygon points="5,72 32,20 58,72" fill="#27333d" />
    {/* Montaña derecha */}
    <polygon points="42,72 68,28 95,72" fill="#27333d" />
    {/* Acento naranja — triángulo pico central */}
    <polygon points="50,10 62,35 38,35" fill="#f26c09" />
    {/* Nodos de conexión */}
    <circle cx="50" cy="10" r="2.5" fill="white" opacity="0.8" />
    <circle cx="32" cy="20" r="2"   fill="white" opacity="0.6" />
    <circle cx="68" cy="28" r="2"   fill="white" opacity="0.6" />
    {/* Líneas de red */}
    <line x1="50" y1="10" x2="32" y2="20" stroke="white" strokeWidth="1" opacity="0.4" />
    <line x1="50" y1="10" x2="68" y2="28" stroke="white" strokeWidth="1" opacity="0.4" />
    <line x1="32" y1="20" x2="68" y2="28" stroke="white" strokeWidth="1" opacity="0.3" />
  </svg>
)

export const Sidebar = () => {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <aside className="flex h-screen w-64 flex-col bg-surface-300 border-r border-white/5">

      {/* Branding */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <KaizenLogoIcon />
        <div>
          <p className="font-heading text-sm font-bold leading-tight text-white tracking-wide uppercase">
            Kaizen
          </p>
          <p className="font-body text-[10px] text-brand-500 font-medium tracking-widest uppercase">
            Report Tool
          </p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/30 font-heading">
          Menú
        </p>
        <ul className="space-y-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                    active
                      ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
                      : 'text-white/50 hover:bg-white/5 hover:text-white/80 border border-transparent'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 flex-shrink-0 ${
                      active ? 'text-brand-500' : 'text-white/40 group-hover:text-white/60'
                    }`}
                  />
                  <span className="font-body font-medium">{label}</span>
                  {active && (
                    <ChevronRight className="ml-auto h-3 w-3 text-brand-500/70" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer agencia */}
      <div className="border-t border-white/10 px-4 py-4">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white font-heading">
            K
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-white/80 font-heading">Kaizen Agency</p>
            <p className="text-[10px] text-white/30 font-body">Evolución Digital Constante</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

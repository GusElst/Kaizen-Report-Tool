'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FileText,
  Layout,
  Settings,
  TrendingUp,
  ChevronRight,
} from 'lucide-react'
import { APP_NAME, APP_TAGLINE } from '@/lib/utils/constants'

const NAV_ITEMS = [
  { href: '/',           label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/clients',    label: 'Clientes',       icon: Users },
  { href: '/reports',    label: 'Reportes',       icon: FileText },
  { href: '/templates',  label: 'Plantillas',     icon: Layout },
  { href: '/settings',   label: 'Configuración',  icon: Settings },
]

export const Sidebar = () => {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-white/10 bg-surface-50">
      {/* Branding */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
          <TrendingUp className="h-5 w-5 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-sm font-bold leading-tight text-white">{APP_NAME}</p>
          <p className="text-[10px] font-medium uppercase tracking-widest text-brand-400">
            {APP_TAGLINE}
          </p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-brand-600/20 text-brand-400'
                      : 'text-gray-400 hover:bg-white/5 hover:text-gray-100'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 flex-shrink-0 ${active ? 'text-brand-400' : 'text-gray-500 group-hover:text-gray-300'}`}
                  />
                  {label}
                  {active && (
                    <ChevronRight className="ml-auto h-3 w-3 text-brand-500" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer — agencia */}
      <div className="border-t border-white/10 px-4 py-4">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white">
            K
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-gray-200">Kaizen Agency</p>
            <p className="text-[10px] text-gray-500">Plan Pro</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

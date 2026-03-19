'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, FileText, Layout, Settings, ChevronRight, X, LogOut } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { logout } from '@/app/actions/auth'

const NAV_ITEMS = [
  { href: '/',           label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/clients',    label: 'Clientes',      icon: Users },
  { href: '/reports',    label: 'Reportes',      icon: FileText },
  { href: '/templates',  label: 'Plantillas',    icon: Layout },
  { href: '/settings',   label: 'Configuración', icon: Settings },
]

const KaizenLogoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="5,72 32,20 58,72" fill="#27333d" />
    <polygon points="42,72 68,28 95,72" fill="#27333d" />
    <polygon points="50,10 62,35 38,35" fill="#f26c09" />
    <circle cx="50" cy="10" r="2.5" fill="white" opacity="0.8" />
    <circle cx="32" cy="20" r="2"   fill="white" opacity="0.6" />
    <circle cx="68" cy="28" r="2"   fill="white" opacity="0.6" />
    <line x1="50" y1="10" x2="32" y2="20" stroke="white" strokeWidth="1" opacity="0.4" />
    <line x1="50" y1="10" x2="68" y2="28" stroke="white" strokeWidth="1" opacity="0.4" />
    <line x1="32" y1="20" x2="68" y2="28" stroke="white" strokeWidth="1" opacity="0.3" />
  </svg>
)

const getInitials = (name: string) =>
  name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

export const MobileNav = ({ open, onClose }: MobileNavProps) => {
  const pathname = usePathname()
  const { user } = useUser()

  useEffect(() => { onClose() }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const displayName = user?.user_metadata?.full_name ?? user?.email ?? 'Usuario'
  const initials = getInitials(displayName)

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-surface-300 border-r border-white/5 transition-transform duration-300 ease-in-out lg:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <KaizenLogoIcon />
            <div>
              <p className="font-heading text-sm font-bold text-white tracking-wide uppercase">Kaizen</p>
              <p className="font-body text-[10px] text-brand-500 font-medium tracking-widest uppercase">Report Tool</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/10 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/30 font-heading">Menú</p>
          <ul className="space-y-0.5">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = isActive(href)
              return (
                <li key={href}>
                  <Link href={href} className={`group flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-all ${active ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20' : 'text-white/50 hover:bg-white/5 hover:text-white/80 border border-transparent'}`}>
                    <Icon className={`h-4 w-4 flex-shrink-0 ${active ? 'text-brand-500' : 'text-white/40 group-hover:text-white/60'}`} />
                    <span className="font-body font-medium">{label}</span>
                    {active && <ChevronRight className="ml-auto h-3 w-3 text-brand-500/70" />}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 px-4 py-4">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white font-heading">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white/80 font-heading">{displayName}</p>
              <p className="truncate text-[10px] text-white/30 font-body">{user?.email}</p>
            </div>
            <form action={logout}>
              <button type="submit" title="Cerrar sesión" className="flex h-7 w-7 items-center justify-center rounded-lg text-white/30 hover:bg-white/10 hover:text-white/60 transition-colors">
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  )
}

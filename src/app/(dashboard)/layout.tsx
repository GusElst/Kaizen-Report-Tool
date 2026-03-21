'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      {/* Sidebar desktop */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Drawer mobile */}
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* Contenido principal */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* El header necesita onMenuClick para mobile — se pasa por children slot */}
        <div className="flex-shrink-0" id="header-slot" data-menu-open={String(mobileNavOpen)} />
        <MobileHeaderTrigger onMenuClick={() => setMobileNavOpen(true)} />
        <MainContent>
          {children}
        </MainContent>
      </div>
    </div>
  )
}

// Componente auxiliar que renderiza el header con acceso al estado del layout
import { Header as HeaderComponent } from '@/components/layout/Header'
import { usePathname } from 'next/navigation'

const ROUTE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/':           { title: 'Dashboard',      subtitle: 'Vista general de la agencia' },
  '/clients':    { title: 'Clientes',        subtitle: 'Gestión de clientes' },
  '/reports':    { title: 'Reportes',        subtitle: 'Gestión y envío de reportes' },
  '/templates':  { title: 'Plantillas',      subtitle: 'Plantillas de reportes' },
  '/settings':   { title: 'Configuración',   subtitle: 'Configuración de la agencia' },
}

// Rutas que usan layout full-screen (sin padding, sin header)
const FULLSCREEN_ROUTES = ['/reports/new', '/reports/edit']

function MobileHeaderTrigger({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname()
  const isFullscreen = FULLSCREEN_ROUTES.some(r => pathname.startsWith(r))
  if (isFullscreen) return null
  const route = ROUTE_TITLES[pathname] ?? { title: 'Kaizen', subtitle: '' }
  return <HeaderComponent title={route.title} subtitle={route.subtitle} onMenuClick={onMenuClick} />
}

function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isFullscreen = FULLSCREEN_ROUTES.some(r => pathname.startsWith(r))

  if (isFullscreen) {
    return (
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    )
  }

  return (
    <main className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="p-4 lg:p-6">
        {children}
      </div>
    </main>
  )
}

export const APP_NAME = 'Kaizen Report Tool'
export const APP_TAGLINE = 'Marketing Reports Engine'
export const LOCALE = 'es-AR'
export const TIMEZONE = 'America/Argentina/Mendoza'

export const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/clients', label: 'Clientes', icon: 'Users' },
  { href: '/reports', label: 'Reportes', icon: 'FileText' },
  { href: '/templates', label: 'Plantillas', icon: 'Layout' },
  { href: '/settings', label: 'Configuración', icon: 'Settings' },
] as const

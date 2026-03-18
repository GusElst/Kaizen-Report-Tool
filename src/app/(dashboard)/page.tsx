import { Header } from '@/components/layout/Header'
import { formatCurrency, formatNumber } from '@/lib/utils/formatters'

// Datos mock — se reemplazarán con datos de Supabase
const MOCK_KPIs = [
  { label: 'Inversión Total', value: formatCurrency(48500), change: +12.4 },
  { label: 'Impresiones',     value: formatNumber(2_840_000), change: +8.1 },
  { label: 'Clicks',          value: formatNumber(94_200), change: -2.3 },
  { label: 'ROAS Promedio',   value: '3.8x', change: +5.7 },
]

const MOCK_CLIENTS = [
  { id: '1', name: 'Bodega Catena',    status: 'active',   reports: 12 },
  { id: '2', name: 'Travel Cuyo',      status: 'active',   reports: 8  },
  { id: '3', name: 'El Solar',         status: 'active',   reports: 5  },
  { id: '4', name: 'Mendoza Turismo',  status: 'inactive', reports: 3  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Header title="Dashboard" subtitle="Vista general de la agencia" />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {MOCK_KPIs.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-white/10 bg-surface-50 p-5"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              {kpi.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-white">{kpi.value}</p>
            <p
              className={`mt-1 text-xs font-medium ${
                kpi.change >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {kpi.change >= 0 ? '+' : ''}{kpi.change}% vs mes anterior
            </p>
          </div>
        ))}
      </div>

      {/* Clientes recientes */}
      <div className="rounded-xl border border-white/10 bg-surface-50">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="text-sm font-semibold text-white">Clientes activos</h2>
          <a href="/clients" className="text-xs text-brand-400 hover:text-brand-300">
            Ver todos →
          </a>
        </div>
        <div className="divide-y divide-white/5">
          {MOCK_CLIENTS.map((client) => (
            <div key={client.id} className="flex items-center justify-between px-6 py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-900 text-xs font-bold text-brand-300">
                  {client.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-gray-200">{client.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500">{client.reports} reportes</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                    client.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-gray-500/10 text-gray-500'
                  }`}
                >
                  {client.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

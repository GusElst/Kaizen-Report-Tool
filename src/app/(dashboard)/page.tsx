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
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {MOCK_KPIs.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-white/5 bg-surface-200 p-4 lg:p-5 hover:border-white/10 transition-colors"
          >
            <p className="font-heading text-[10px] font-semibold uppercase tracking-widest text-white/40">
              {kpi.label}
            </p>
            <p className="font-heading mt-2 text-xl lg:text-2xl font-bold text-white">{kpi.value}</p>
            <p className={`font-body mt-1 text-xs font-medium ${kpi.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {kpi.change >= 0 ? '▲' : '▼'} {Math.abs(kpi.change)}% vs mes anterior
            </p>
          </div>
        ))}
      </div>

      {/* Clientes recientes */}
      <div className="rounded-xl border border-white/5 bg-surface-200">
        <div className="flex items-center justify-between border-b border-white/5 px-4 lg:px-6 py-4">
          <h2 className="font-heading text-sm font-bold text-white uppercase tracking-wide">
            Clientes activos
          </h2>
          <a href="/clients" className="font-body text-xs text-brand-500 hover:text-brand-400 transition-colors">
            Ver todos →
          </a>
        </div>
        <div className="divide-y divide-white/5">
          {MOCK_CLIENTS.map((client) => (
            <div key={client.id} className="flex items-center justify-between px-4 lg:px-6 py-3.5 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-400 text-xs font-bold text-brand-400 font-heading border border-white/10 flex-shrink-0">
                  {client.name.charAt(0)}
                </div>
                <span className="font-body text-sm font-medium text-white/80">{client.name}</span>
              </div>
              <div className="flex items-center gap-2 lg:gap-4">
                <span className="font-body text-xs text-white/30 hidden sm:inline">{client.reports} reportes</span>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest font-heading ${
                  client.status === 'active'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-white/5 text-white/30 border border-white/10'
                }`}>
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

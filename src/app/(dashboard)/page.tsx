import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatNumber } from '@/lib/utils/formatters'

export default async function DashboardPage() {
  const supabase = createClient()

  // Obtener clientes reales
  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, status')
    .order('created_at', { ascending: false })
    .limit(5)

  const activeClients = clients?.filter((c) => c.status === 'active') ?? []

  // KPIs — por ahora con valores base (se conectarán a métricas reales más adelante)
  const KPIs = [
    { label: 'Clientes activos', value: formatNumber(activeClients.length), change: null },
    { label: 'Inversión Total',  value: formatCurrency(0), change: null },
    { label: 'Impresiones',      value: formatNumber(0),   change: null },
    { label: 'ROAS Promedio',    value: '—',               change: null },
  ]

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {KPIs.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-white/5 bg-surface-200 p-4 lg:p-5 hover:border-white/10 transition-colors"
          >
            <p className="font-heading text-[10px] font-semibold uppercase tracking-widest text-white/40">
              {kpi.label}
            </p>
            <p className="font-heading mt-2 text-xl lg:text-2xl font-bold text-white">{kpi.value}</p>
            {kpi.change !== null ? (
              <p className={`font-body mt-1 text-xs font-medium ${kpi.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {kpi.change >= 0 ? '▲' : '▼'} {Math.abs(kpi.change)}% vs mes anterior
              </p>
            ) : (
              <p className="font-body mt-1 text-xs text-white/20">Sin datos aún</p>
            )}
          </div>
        ))}
      </div>

      {/* Clientes recientes */}
      <div className="rounded-xl border border-white/5 bg-surface-200">
        <div className="flex items-center justify-between border-b border-white/5 px-4 lg:px-6 py-4">
          <h2 className="font-heading text-sm font-bold text-white uppercase tracking-wide">
            Clientes recientes
          </h2>
          <a href="/clients" className="font-body text-xs text-brand-500 hover:text-brand-400 transition-colors">
            Ver todos →
          </a>
        </div>
        <div className="divide-y divide-white/5">
          {clients && clients.length > 0 ? clients.map((client) => (
            <div key={client.id} className="flex items-center justify-between px-4 lg:px-6 py-3.5 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-400 text-xs font-bold text-brand-400 font-heading border border-white/10 flex-shrink-0">
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-body text-sm font-medium text-white/80">{client.name}</span>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest font-heading ${
                client.status === 'active'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : client.status === 'paused'
                  ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  : 'bg-white/5 text-white/30 border border-white/10'
              }`}>
                {client.status === 'active' ? 'Activo' : client.status === 'paused' ? 'Pausado' : 'Archivado'}
              </span>
            </div>
          )) : (
            <div className="px-6 py-10 text-center">
              <p className="font-body text-sm text-white/30">Todavía no hay clientes</p>
              <a href="/clients" className="font-body text-xs text-brand-500 hover:text-brand-400 mt-2 inline-block transition-colors">
                Crear primer cliente →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

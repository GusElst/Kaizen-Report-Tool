import { Header } from '@/components/layout/Header'

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <Header title="Reportes" subtitle="Gestión y envío de reportes" />
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-white/10 text-gray-500">
        Lista de reportes — próximamente
      </div>
    </div>
  )
}

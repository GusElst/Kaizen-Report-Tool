import { Header } from '@/components/layout/Header'

interface Props {
  params: { id: string }
}

export default function ReportPreviewPage({ params }: Props) {
  return (
    <div className="space-y-6">
      <Header title="Vista Previa" subtitle={`Reporte #${params.id}`} />
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-white/10 text-gray-500">
        Vista previa del reporte — próximamente
      </div>
    </div>
  )
}

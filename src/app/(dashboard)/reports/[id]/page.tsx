import { Header } from '@/components/layout/Header'

interface Props {
  params: { id: string }
}

export default function ReportEditorPage({ params }: Props) {
  return (
    <div className="space-y-6">
      <Header title={`Reporte #${params.id}`} subtitle="Editor de reporte" />
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-white/10 text-gray-500">
        Editor de reporte — próximamente
      </div>
    </div>
  )
}

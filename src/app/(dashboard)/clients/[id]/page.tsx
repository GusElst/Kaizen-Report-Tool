import { Header } from '@/components/layout/Header'

interface Props {
  params: { id: string }
}

export default function ClientDetailPage({ params }: Props) {
  return (
    <div className="space-y-6">
      <Header title={`Cliente #${params.id}`} subtitle="Detalle del cliente" />
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-white/10 text-gray-500">
        Detalle cliente — próximamente
      </div>
    </div>
  )
}

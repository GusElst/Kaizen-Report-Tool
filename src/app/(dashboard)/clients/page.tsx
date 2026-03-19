'use client'

import { useState } from 'react'
import { Plus, Search, Users } from 'lucide-react'
import { useClients, type Client } from '@/hooks/useClients'
import { ClientCard } from '@/components/clients/ClientCard'
import { ClientModal } from '@/components/clients/ClientModal'

export default function ClientsPage() {
  const { clients, loading, createClient, updateClient, deleteClient } = useClients()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [deletingClient, setDeletingClient] = useState<Client | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.industry ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setModalOpen(true)
  }

  const handleCreate = () => {
    setEditingClient(null)
    setModalOpen(true)
  }

  const handleSubmit = async (data: Record<string, unknown>) => {
    if (editingClient) return updateClient(editingClient.id, data)
    return createClient(data as Parameters<typeof createClient>[0])
  }

  const handleDeleteConfirm = async () => {
    if (!deletingClient) return
    setDeleteLoading(true)
    await deleteClient(deletingClient.id)
    setDeleteLoading(false)
    setDeletingClient(null)
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Búsqueda */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar clientes..."
            className="w-full rounded-lg border border-white/10 bg-surface-200 pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all font-body"
          />
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 transition-colors font-heading flex-shrink-0"
        >
          <Plus className="h-4 w-4" />
          Nuevo cliente
        </button>
      </div>

      {/* Estados */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 rounded-xl bg-surface-200 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-20 text-center">
          <Users className="h-10 w-10 text-white/20 mb-4" />
          {search ? (
            <>
              <p className="font-heading text-sm font-semibold text-white/40">Sin resultados</p>
              <p className="font-body text-xs text-white/25 mt-1">No encontramos clientes con &quot;{search}&quot;</p>
            </>
          ) : (
            <>
              <p className="font-heading text-sm font-semibold text-white/40">Todavía no hay clientes</p>
              <p className="font-body text-xs text-white/25 mt-1 mb-4">Creá tu primer cliente para empezar</p>
              <button onClick={handleCreate}
                className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors font-heading">
                <Plus className="h-4 w-4" /> Crear cliente
              </button>
            </>
          )}
        </div>
      ) : (
        <>
          <p className="font-body text-xs text-white/30">
            {filtered.length} cliente{filtered.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onEdit={handleEdit}
                onDelete={setDeletingClient}
              />
            ))}
          </div>
        </>
      )}

      {/* Modal crear/editar */}
      <ClientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        client={editingClient}
      />

      {/* Modal confirmar eliminación */}
      {deletingClient && (
        <>
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setDeletingClient(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-surface-200 p-6 shadow-2xl">
              <h3 className="font-heading text-base font-bold text-white mb-2">¿Eliminar cliente?</h3>
              <p className="font-body text-sm text-white/50 mb-6">
                Vas a eliminar a <span className="text-white font-medium">{deletingClient.name}</span>. Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeletingClient(null)}
                  className="flex-1 rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors font-body">
                  Cancelar
                </button>
                <button onClick={handleDeleteConfirm} disabled={deleteLoading}
                  className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50 transition-colors font-heading">
                  {deleteLoading ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

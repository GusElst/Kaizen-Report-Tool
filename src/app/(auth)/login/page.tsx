'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

const KaizenLogo = () => (
  <svg width="48" height="40" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="5,72 32,20 58,72" fill="#27333d" />
    <polygon points="42,72 68,28 95,72" fill="#27333d" />
    <polygon points="50,10 62,35 38,35" fill="#f26c09" />
    <circle cx="50" cy="10" r="2.5" fill="white" opacity="0.8" />
    <circle cx="32" cy="20" r="2" fill="white" opacity="0.6" />
    <circle cx="68" cy="28" r="2" fill="white" opacity="0.6" />
    <line x1="50" y1="10" x2="32" y2="20" stroke="white" strokeWidth="1" opacity="0.4" />
    <line x1="50" y1="10" x2="68" y2="28" stroke="white" strokeWidth="1" opacity="0.4" />
    <line x1="32" y1="20" x2="68" y2="28" stroke="white" strokeWidth="1" opacity="0.3" />
  </svg>
)

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase!.auth.signInWithPassword({ email, password })

    if (error) {
      setError(
        error.message === 'Invalid login credentials'
          ? 'Email o contraseña incorrectos'
          : error.message
      )
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="w-full max-w-sm">
      {/* Logo y branding */}
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <KaizenLogo />
        </div>
        <h1 className="font-heading text-2xl font-bold text-white tracking-wide">KAIZEN</h1>
        <p className="font-body text-xs text-white/40 mt-1 tracking-widest uppercase">
          Report Tool
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-white/10 bg-surface-100 p-8">
        <h2 className="font-heading text-lg font-bold text-white mb-1">Bienvenido</h2>
        <p className="font-body text-sm text-white/40 mb-6">Ingresá con tu cuenta de agencia</p>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="font-body text-xs font-medium text-white/60 block mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@agencia.com"
              required
              className="w-full rounded-lg border border-white/10 bg-surface-200 px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all font-body"
            />
          </div>

          {/* Contraseña */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-body text-xs font-medium text-white/60">Contraseña</label>
              <Link href="/forgot-password" className="font-body text-xs text-brand-500 hover:text-brand-400 transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-white/10 bg-surface-200 px-4 py-2.5 pr-10 text-sm text-white placeholder:text-white/20 outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all font-body"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
              <p className="font-body text-xs text-red-400">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-heading mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Ingresando...
              </>
            ) : (
              'Ingresar'
            )}
          </button>
        </form>
      </div>

      {/* Registro */}
      <p className="font-body text-center text-xs text-white/30 mt-6">
        ¿No tenés cuenta?{' '}
        <Link href="/register" className="text-brand-500 hover:text-brand-400 transition-colors">
          Crear agencia
        </Link>
      </p>
    </div>
  )
}

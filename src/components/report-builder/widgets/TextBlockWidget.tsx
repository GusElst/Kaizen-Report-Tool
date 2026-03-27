'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import type { TextBlockConfig, ChannelType } from '@/types/reports'
import { Sparkles, Loader2 } from 'lucide-react'

interface TextBlockWidgetProps {
  data: TextBlockConfig
  isEditing?: boolean
  onChange?: (content: string) => void
  sectionName?: string
  channel?: ChannelType
}

const PROSE_CLASSES = `prose prose-invert prose-sm max-w-none
  [&_h3]:text-white [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mb-2
  [&_p]:text-surface-300 [&_p]:leading-relaxed [&_p]:mb-2
  [&_ul]:text-surface-300 [&_ul]:pl-4
  [&_li]:mb-1
  [&_strong]:text-white`

const TextBlockWidget = ({ data, isEditing = false, onChange, sectionName, channel }: TextBlockWidgetProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const editorRef = useRef<HTMLDivElement | null>(null)
  const contentSetRef = useRef(false)
  const localContentRef = useRef(data.content)

  // Store initial content to use in callback ref
  const initialContentRef = useRef(data.content)

  // Callback ref: set content immediately when the DOM node mounts
  const setEditorRef = useCallback((node: HTMLDivElement | null) => {
    editorRef.current = node
    if (node && !contentSetRef.current) {
      node.innerHTML = initialContentRef.current || ''
      contentSetRef.current = true
    }
  }, [])

  // Sync content from outside (e.g. AI generation) while not focused
  useEffect(() => {
    if (!editorRef.current || isFocused || !contentSetRef.current) return
    editorRef.current.innerHTML = data.content || ''
  }, [data.content, isFocused])

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML
      localContentRef.current = html
      onChange?.(html)
    }
  }, [onChange])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    if (editorRef.current) {
      const html = editorRef.current.innerHTML
      localContentRef.current = html
      onChange?.(html)
    }
  }, [onChange])

  const handleGenerateAI = async () => {
    setIsGenerating(true)
    // Simulamos generación (en producción: POST /api/ai/analyze)
    await new Promise(resolve => setTimeout(resolve, 1500))

    const analysis = generateMockAnalysis(sectionName, channel)

    // Update editor directly and notify parent
    if (editorRef.current) {
      editorRef.current.innerHTML = analysis
    }
    localContentRef.current = analysis
    onChange?.(analysis)
    setIsGenerating(false)
  }

  if (!isEditing) {
    return (
      <div className="rounded-xl border border-surface-100 bg-surface-50 p-4">
        <div
          className={PROSE_CLASSES}
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      </div>
    )
  }

  return (
    <div className={`rounded-xl border bg-surface-50 p-4 transition-colors ${isFocused ? 'border-brand' : 'border-surface-100'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-surface-400 font-medium">Bloque de Texto</span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleGenerateAI()
          }}
          disabled={isGenerating}
          className="flex items-center gap-1 text-xs text-brand/80 hover:text-brand transition-colors px-2 py-1 rounded-md hover:bg-brand/10 disabled:opacity-50"
        >
          {isGenerating ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Sparkles className="w-3 h-3" />
          )}
          {isGenerating ? 'Generando...' : 'Analizar con IA'}
        </button>
      </div>
      <div
        ref={setEditorRef}
        className={`min-h-[80px] outline-none text-sm leading-relaxed ${PROSE_CLASSES}
          empty:before:content-[attr(data-placeholder)] empty:before:text-surface-500`}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={data.placeholder || 'Escribí tu análisis aquí...'}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
      />
    </div>
  )
}

// Mock de análisis IA por sección
const generateMockAnalysis = (sectionName?: string, channel?: ChannelType): string => {
  const analyses: Record<string, string> = {
    facebook: `<h3>Análisis Facebook — Período Actual</h3>
<p>El <strong>alcance orgánico creció un 12.5%</strong> respecto al período anterior, impulsado principalmente por el post promocional del fin de semana que alcanzó 12.104 personas.</p>
<p>Las <strong>reacciones bajaron un 8.3%</strong>, lo cual es esperable dado que el algoritmo priorizó distribución sobre engagement en este período.</p>
<ul>
<li><strong>Fortaleza:</strong> Los posts con emojis y ofertas concretas generan 3x más shares que el contenido institucional.</li>
<li><strong>Oportunidad:</strong> Publicar entre las 19-21hs genera mayor alcance en el público de Mendoza.</li>
<li><strong>Recomendación:</strong> Aumentar frecuencia de posts con formato carrusel que mostraron mejor CTR.</li>
</ul>`,
    instagram: `<h3>Análisis Instagram — Período Actual</h3>
<p>Las <strong>vistas aumentaron un 34.2%</strong> gracias al formato Reels que sigue siendo el de mayor alcance orgánico en la plataforma.</p>
<p>El <strong>engagement se mantiene sólido (+18.9%)</strong>, con los carruseles generando la mayor interacción por publicación.</p>
<ul>
<li><strong>Fortaleza:</strong> Los Reels de "behind the scenes" tienen un avg watch time superior al promedio.</li>
<li><strong>Oportunidad:</strong> Explotar más el formato Stories con encuestas y stickers interactivos.</li>
<li><strong>Recomendación:</strong> Mantener cadencia de 3-4 Reels semanales y 1 carrusel educativo.</li>
</ul>`,
    tiktok: `<h3>Análisis TikTok — Período Actual</h3>
<p>El canal muestra una <strong>caída significativa en alcance (-90.9%)</strong> y video views (-85.2%), producto de una menor frecuencia de publicación en este período.</p>
<p>Sin embargo, el <strong>avg watch time mejoró un 15.3%</strong>, indicando que el contenido que se publica tiene buena retención.</p>
<ul>
<li><strong>Fortaleza:</strong> El contenido de "proceso de elaboración" genera mayor retención que el contenido de producto final.</li>
<li><strong>Problema:</strong> La baja frecuencia de publicación afecta directamente el alcance del algoritmo.</li>
<li><strong>Recomendación:</strong> Incrementar a mínimo 4 videos semanales para recuperar tracción en el algoritmo.</li>
</ul>`,
    linkedin: `<h3>Análisis LinkedIn — Período Actual</h3>
<p>Los <strong>page views crecieron un 45.8%</strong>, mostrando un interés creciente en el perfil corporativo de la marca.</p>
<p>El <strong>engagement rate del 12.4%</strong> está muy por encima del benchmark de la industria (2-5%).</p>
<ul>
<li><strong>Fortaleza:</strong> Los posts de casos de éxito y cultura empresarial generan el mayor engagement.</li>
<li><strong>Oportunidad:</strong> Activar LinkedIn Newsletter para capitalizar la audiencia creciente.</li>
<li><strong>Recomendación:</strong> Publicar contenido de employer branding 2x por semana.</li>
</ul>`,
    meta_ads: `<h3>Análisis Meta Ads — Período Actual</h3>
<p>La inversión total fue de <strong>$115.234 ARS</strong> con un alcance de 40.215 personas y 4.168 clics.</p>
<p>El <strong>CPC subió un 12.5%</strong> ($27,65) respecto al período anterior. La campaña de Conversiones tiene el mejor CPC ($24,12) mientras que Tráfico tiene el más alto ($32,58).</p>
<ul>
<li><strong>Fortaleza:</strong> La campaña de Conversiones genera leads a menor costo que las demás.</li>
<li><strong>Problema:</strong> El CTR bajó un 16.4%, sugiriendo fatiga creativa en los anuncios actuales.</li>
<li><strong>Recomendación:</strong> Renovar creatividades, reasignar 20% del presupuesto de Tráfico hacia Conversiones, y testear audiencias lookalike.</li>
</ul>`,
    instagram_ads: `<h3>Análisis Instagram Ads — Período Actual</h3>
<p>Las <strong>impresiones crecieron un 28.4%</strong> con un alcance de 22.890 usuarios únicos.</p>
<p>Los clics aumentaron un 5.8% pero el <strong>costo subió un 11.2%</strong>, indicando mayor competencia en la subasta.</p>
<ul>
<li><strong>Fortaleza:</strong> Los formatos de Stories Ads tienen mejor CTR que los de Feed.</li>
<li><strong>Oportunidad:</strong> Testear formato Reels Ads que suele tener CPM más bajo.</li>
<li><strong>Recomendación:</strong> Segmentar por intereses gastronómicos y usar retargeting de visitantes del perfil.</li>
</ul>`,
  }

  return analyses[channel || ''] || `<h3>Análisis del Período</h3>
<p>Resumen del rendimiento para <strong>${sectionName || 'esta sección'}</strong>.</p>
<ul>
<li><strong>Punto fuerte:</strong> Identificar las métricas con mejor rendimiento del período.</li>
<li><strong>Oportunidad:</strong> Áreas donde se puede mejorar con acciones específicas.</li>
<li><strong>Recomendación:</strong> Próximos pasos sugeridos para el siguiente período.</li>
</ul>`
}

export default TextBlockWidget

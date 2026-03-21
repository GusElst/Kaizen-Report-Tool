// Datos mock basados en el reporte real de T.D.E. (Tienda de Empanadas)
import type { ReportSection, ReportWidget } from '@/types/reports'

// Helper para generar IDs únicos
let _id = 0
const uid = () => `mock-${++_id}`

// === Time series: 1-9 marzo 2025 ===
const DATES = [
  '2025-03-01', '2025-03-02', '2025-03-03', '2025-03-04', '2025-03-05',
  '2025-03-06', '2025-03-07', '2025-03-08', '2025-03-09',
]

// Helper para generar serie temporal con variación
const timeSeries = (base: number, variance: number) =>
  DATES.map(date => ({
    date,
    value: Math.round(base + (Math.random() - 0.5) * variance),
  }))

// ============================================================
// SECCIÓN 1: Facebook Performance
// ============================================================
const facebookKPIs: ReportWidget[] = [
  {
    id: uid(), colSpan: 1,
    config: { type: 'kpi_card', data: { metricKey: 'fb_reach', label: 'Alcance', value: 25347, format: 'number', change: 12.5, previousValue: 22531, channel: 'facebook' } },
  },
  {
    id: uid(), colSpan: 1,
    config: { type: 'kpi_card', data: { metricKey: 'fb_reactions', label: 'Reacciones', value: 1842, format: 'number', change: -8.3, previousValue: 2009, channel: 'facebook' } },
  },
  {
    id: uid(), colSpan: 1,
    config: { type: 'kpi_card', data: { metricKey: 'fb_fans', label: 'Fans', value: 19234, format: 'number', change: 1.2, previousValue: 19005, channel: 'facebook' } },
  },
  {
    id: uid(), colSpan: 1,
    config: { type: 'kpi_card', data: { metricKey: 'fb_page_views', label: 'Page Views', value: 203, format: 'number', change: 620.6, previousValue: 28, channel: 'facebook' } },
  },
]

const facebookChart: ReportWidget = {
  id: uid(), colSpan: 2,
  config: {
    type: 'area_chart',
    data: {
      title: 'Alcance por Día',
      subtitle: '1 mar - 9 mar 2025',
      xAxisKey: 'date',
      granularity: 'daily',
      series: [
        { key: 'organic', label: 'Orgánico', color: '#1877F2', data: timeSeries(2800, 1500) },
        { key: 'paid', label: 'Pagado', color: '#42a5f5', data: timeSeries(1200, 800) },
      ],
    },
  },
}

const facebookPostsTable: ReportWidget = {
  id: uid(), colSpan: 4,
  config: {
    type: 'data_table',
    data: {
      title: 'Rendimiento de Posts',
      variant: 'posts',
      columns: [
        { key: 'post', label: 'Post', format: 'text' },
        { key: 'date', label: 'Fecha', format: 'text' },
        { key: 'reach', label: 'Alcance', format: 'number', sortable: true },
        { key: 'likes', label: 'Me gusta', format: 'number', sortable: true },
        { key: 'shares', label: 'Shares', format: 'number', sortable: true },
      ],
      rows: [
        { post: '🍕 Nuestras empanadas de carne cortada a cuchillo...', date: '3 mar', reach: 8432, likes: 342, shares: 87, thumbnail: '/images/mock/post1.jpg' },
        { post: '🎉 ¡Promo del finde! 12 empanadas + bebida...', date: '5 mar', reach: 12104, likes: 891, shares: 234, thumbnail: '/images/mock/post2.jpg' },
        { post: '📍 Nos mudamos a nuestro nuevo local en...', date: '7 mar', reach: 6543, likes: 456, shares: 123, thumbnail: '/images/mock/post3.jpg' },
        { post: '🔥 Las más pedidas: carne suave, jamón y queso...', date: '9 mar', reach: 4268, likes: 153, shares: 45, thumbnail: '/images/mock/post4.jpg' },
      ],
      showTotals: true,
    },
  },
}

// ============================================================
// SECCIÓN 2: Instagram Performance
// ============================================================
const instagramKPIs: ReportWidget[] = [
  {
    id: uid(), colSpan: 1,
    config: { type: 'kpi_card', data: { metricKey: 'ig_views', label: 'Vistas', value: 151230, format: 'number', change: 34.2, previousValue: 112690, channel: 'instagram' } },
  },
  {
    id: uid(), colSpan: 1,
    config: { type: 'kpi_card', data: { metricKey: 'ig_reach', label: 'Alcance', value: 41872, format: 'number', change: -5.1, previousValue: 44120, channel: 'instagram' } },
  },
  {
    id: uid(), colSpan: 1,
    config: { type: 'kpi_card', data: { metricKey: 'ig_engagement', label: 'Engagement', value: 676, format: 'number', change: 18.9, previousValue: 568, channel: 'instagram' } },
  },
  {
    id: uid(), colSpan: 1,
    config: { type: 'kpi_card', data: { metricKey: 'ig_followers', label: 'Followers', value: 812, format: 'number', change: 3.4, previousValue: 785, channel: 'instagram' } },
  },
]

const instagramChart: ReportWidget = {
  id: uid(), colSpan: 2,
  config: {
    type: 'line_chart',
    data: {
      title: 'Vistas por Día',
      subtitle: '1 mar - 9 mar 2025',
      xAxisKey: 'date',
      granularity: 'daily',
      series: [
        { key: 'views', label: 'Vistas', color: '#E1306C', data: timeSeries(16800, 8000) },
      ],
    },
  },
}

const instagramEngagementChart: ReportWidget = {
  id: uid(), colSpan: 2,
  config: {
    type: 'bar_chart',
    data: {
      title: 'Engagement por Día',
      subtitle: '1 mar - 9 mar 2025',
      xAxisKey: 'date',
      granularity: 'daily',
      series: [
        { key: 'engagement', label: 'Interacciones', color: '#F77737', data: timeSeries(75, 40) },
      ],
    },
  },
}

const instagramPostsTable: ReportWidget = {
  id: uid(), colSpan: 4,
  config: {
    type: 'data_table',
    data: {
      title: 'Rendimiento de Posts',
      variant: 'posts',
      columns: [
        { key: 'post', label: 'Post', format: 'text' },
        { key: 'date', label: 'Fecha', format: 'text' },
        { key: 'views', label: 'Vistas', format: 'number', sortable: true },
        { key: 'reach', label: 'Alcance', format: 'number', sortable: true },
        { key: 'engagement', label: 'Engagement', format: 'number', sortable: true },
      ],
      rows: [
        { post: '📸 Reel: El arte de hacer empanadas artesanales', date: '2 mar', views: 45200, reach: 12300, engagement: 234, thumbnail: '/images/mock/ig1.jpg' },
        { post: '🎬 Stories: Un día en T.D.E.', date: '4 mar', views: 38100, reach: 9800, engagement: 187, thumbnail: '/images/mock/ig2.jpg' },
        { post: '📷 Carrusel: 5 sabores que tenés que probar', date: '6 mar', views: 52340, reach: 15200, engagement: 312, thumbnail: '/images/mock/ig3.jpg' },
      ],
      showTotals: true,
    },
  },
}

// ============================================================
// SECCIÓN 3: TikTok Performance
// ============================================================
const tiktokKPIs: ReportWidget[] = [
  {
    id: uid(), colSpan: 1,
    config: { type: 'kpi_card', data: { metricKey: 'tt_followers', label: 'Followers', value: 342, format: 'number', change: null, previousValue: 0, channel: 'tiktok' } },
  },
  {
    id: uid(), colSpan: 1,
    config: { type: 'kpi_card', data: { metricKey: 'tt_reach', label: 'Alcance', value: 461, format: 'number', change: -90.9, previousValue: 5065, channel: 'tiktok' } },
  },
  {
    id: uid(), colSpan: 1,
    config: { type: 'kpi_card', data: { metricKey: 'tt_views', label: 'Video Views', value: 1723, format: 'number', change: -85.2, previousValue: 11640, channel: 'tiktok' } },
  },
  {
    id: uid(), colSpan: 1,
    config: { type: 'kpi_card', data: { metricKey: 'tt_avg_watch', label: 'Avg Watch Time', value: 4.2, format: 'time', change: 15.3, previousValue: 3.6, channel: 'tiktok' } },
  },
]

const tiktokPostsTable: ReportWidget = {
  id: uid(), colSpan: 4,
  config: {
    type: 'data_table',
    data: {
      title: 'Rendimiento de Videos',
      variant: 'posts',
      columns: [
        { key: 'post', label: 'Video', format: 'text' },
        { key: 'date', label: 'Fecha', format: 'text' },
        { key: 'views', label: 'Views', format: 'number', sortable: true },
        { key: 'likes', label: 'Me gusta', format: 'number', sortable: true },
        { key: 'avgWatch', label: 'Avg Watch', format: 'time' },
        { key: 'fullVideo', label: 'Full Video %', format: 'percent' },
        { key: 'reach', label: 'Alcance', format: 'number', sortable: true },
      ],
      rows: [
        { post: 'El secreto de nuestro repulgue 🤫', date: '1 mar', views: 892, likes: 67, avgWatch: 5.1, fullVideo: 32, reach: 245, thumbnail: '/images/mock/tt1.jpg' },
        { post: 'POV: llegas a T.D.E. un viernes', date: '4 mar', views: 534, likes: 41, avgWatch: 3.8, fullVideo: 24, reach: 142, thumbnail: '/images/mock/tt2.jpg' },
        { post: 'Empanada speed run 🏃‍♂️', date: '7 mar', views: 297, likes: 23, avgWatch: 3.2, fullVideo: 18, reach: 74, thumbnail: '/images/mock/tt3.jpg' },
      ],
      showTotals: true,
    },
  },
}

// ============================================================
// SECCIÓN 4: LinkedIn Performance
// ============================================================
const linkedinKPIs: ReportWidget[] = [
  {
    id: uid(), colSpan: 1,
    config: { type: 'kpi_card', data: { metricKey: 'li_page_views', label: 'Page Views', value: 2272, format: 'number', change: 45.8, previousValue: 1558, channel: 'linkedin' } },
  },
  {
    id: uid(), colSpan: 1,
    config: { type: 'kpi_card', data: { metricKey: 'li_engagement', label: 'Engagement Rate', value: 12.4, format: 'percent', change: 2.1, previousValue: 12.14, channel: 'linkedin' } },
  },
  {
    id: uid(), colSpan: 1,
    config: { type: 'kpi_card', data: { metricKey: 'li_followers', label: 'Followers', value: 2735, format: 'number', change: 4.7, previousValue: 2612, channel: 'linkedin' } },
  },
  {
    id: uid(), colSpan: 1,
    config: { type: 'kpi_card', data: { metricKey: 'li_clicks', label: 'Clicks', value: 165, format: 'number', change: -12.3, previousValue: 188, channel: 'linkedin' } },
  },
]

const linkedinPostsTable: ReportWidget = {
  id: uid(), colSpan: 4,
  config: {
    type: 'data_table',
    data: {
      title: 'Rendimiento de Posts',
      variant: 'posts',
      columns: [
        { key: 'post', label: 'Post', format: 'text' },
        { key: 'date', label: 'Fecha', format: 'text' },
        { key: 'impressions', label: 'Impressions', format: 'number', sortable: true },
        { key: 'likes', label: 'Likes', format: 'number', sortable: true },
        { key: 'clicks', label: 'Clicks', format: 'number', sortable: true },
        { key: 'comments', label: 'Comments', format: 'number' },
        { key: 'shares', label: 'Shares', format: 'number' },
      ],
      rows: [
        { post: 'Crecimiento sostenido en el rubro gastronómico...', date: '2 mar', impressions: 3420, likes: 89, clicks: 56, comments: 12, shares: 8 },
        { post: 'Nuestro equipo suma nuevos talentos 🎯', date: '5 mar', impressions: 2890, likes: 134, clicks: 67, comments: 23, shares: 15 },
        { post: 'Caso de éxito: transformación digital en...', date: '8 mar', impressions: 4100, likes: 201, clicks: 42, comments: 8, shares: 21 },
      ],
      showTotals: true,
    },
  },
}

// ============================================================
// SECCIÓN 5: Meta Ads Performance
// ============================================================
const metaAdsKPIs: ReportWidget[] = [
  {
    id: uid(), colSpan: 1,
    config: { type: 'kpi_card', data: { metricKey: 'meta_cost', label: 'Costo', value: 115234, format: 'currency_ars', change: 8.4, previousValue: 106300, channel: 'meta_ads' } },
  },
  {
    id: uid(), colSpan: 1,
    config: { type: 'kpi_card', data: { metricKey: 'meta_impressions', label: 'Impresiones', value: 79432, format: 'number', change: 15.2, previousValue: 68950, channel: 'meta_ads' } },
  },
  {
    id: uid(), colSpan: 1,
    config: { type: 'kpi_card', data: { metricKey: 'meta_reach', label: 'Alcance', value: 40215, format: 'number', change: 22.1, previousValue: 32937, channel: 'meta_ads' } },
  },
  {
    id: uid(), colSpan: 1,
    config: { type: 'kpi_card', data: { metricKey: 'meta_clicks', label: 'Clics', value: 4168, format: 'number', change: -3.7, previousValue: 4328, channel: 'meta_ads' } },
  },
]

const metaAdsKPIs2: ReportWidget[] = [
  {
    id: uid(), colSpan: 1,
    config: { type: 'kpi_card', data: { metricKey: 'meta_cpc', label: 'CPC', value: 27.65, format: 'currency_ars', change: 12.5, previousValue: 24.58, channel: 'meta_ads' } },
  },
  {
    id: uid(), colSpan: 1,
    config: { type: 'kpi_card', data: { metricKey: 'meta_ctr', label: 'CTR', value: 5.24, format: 'percent', change: -16.4, previousValue: 6.27, channel: 'meta_ads' } },
  },
  {
    id: uid(), colSpan: 1,
    config: { type: 'kpi_card', data: { metricKey: 'meta_leads', label: 'Leads', value: 47, format: 'number', change: null, previousValue: 0, channel: 'meta_ads' } },
  },
  {
    id: uid(), colSpan: 1,
    config: { type: 'kpi_card', data: { metricKey: 'meta_cpl', label: 'Costo/Lead', value: 2451.78, format: 'currency_ars', change: null, previousValue: 0, channel: 'meta_ads' } },
  },
]

const metaAdsChart: ReportWidget = {
  id: uid(), colSpan: 2,
  config: {
    type: 'bar_chart',
    data: {
      title: 'Clics por Día',
      subtitle: '1 mar - 9 mar 2025',
      xAxisKey: 'date',
      granularity: 'daily',
      series: [
        { key: 'clicks', label: 'Clics', color: '#0081FB', data: timeSeries(460, 200) },
      ],
    },
  },
}

const metaAdsPieChart: ReportWidget = {
  id: uid(), colSpan: 2,
  config: {
    type: 'pie_chart',
    data: {
      title: 'Distribución por Colocación',
      xAxisKey: 'placement',
      granularity: 'daily',
      series: [
        { key: 'feed', label: 'Feed', color: '#0081FB', data: [{ date: 'feed', value: 45 }] },
        { key: 'stories', label: 'Stories', color: '#42a5f5', data: [{ date: 'stories', value: 28 }] },
        { key: 'reels', label: 'Reels', color: '#90caf9', data: [{ date: 'reels', value: 18 }] },
        { key: 'other', label: 'Otros', color: '#bbdefb', data: [{ date: 'other', value: 9 }] },
      ],
    },
  },
}

const metaAdsCampaignsTable: ReportWidget = {
  id: uid(), colSpan: 4,
  config: {
    type: 'data_table',
    data: {
      title: 'Rendimiento de Campañas',
      variant: 'campaigns',
      columns: [
        { key: 'campaign', label: 'Campaña', format: 'text' },
        { key: 'impressions', label: 'Impresiones', format: 'number', sortable: true },
        { key: 'reach', label: 'Alcance', format: 'number', sortable: true },
        { key: 'clicks', label: 'Clics', format: 'number', sortable: true },
        { key: 'ctr', label: 'CTR', format: 'percent' },
        { key: 'cpc', label: 'CPC', format: 'currency_ars' },
        { key: 'leads', label: 'Leads', format: 'number' },
        { key: 'cost', label: 'Costo', format: 'currency_ars', sortable: true },
      ],
      rows: [
        { campaign: 'TDE - Conversiones - Marzo', impressions: 35200, reach: 18400, clicks: 1890, ctr: 5.37, cpc: 24.12, leads: 23, cost: 45587 },
        { campaign: 'TDE - Alcance - Branding', impressions: 28900, reach: 15200, clicks: 1245, ctr: 4.31, cpc: 28.90, leads: 12, cost: 35981 },
        { campaign: 'TDE - Tráfico - Menú Online', impressions: 15332, reach: 6615, clicks: 1033, ctr: 6.74, cpc: 32.58, leads: 12, cost: 33666 },
      ],
      showTotals: true,
    },
  },
}

// ============================================================
// SECCIÓN 6: Instagram Ads Performance
// ============================================================
const igAdsKPIs: ReportWidget[] = [
  {
    id: uid(), colSpan: 1,
    config: { type: 'kpi_card', data: { metricKey: 'igads_impressions', label: 'Impresiones', value: 42310, format: 'number', change: 28.4, previousValue: 32950, channel: 'instagram_ads' } },
  },
  {
    id: uid(), colSpan: 1,
    config: { type: 'kpi_card', data: { metricKey: 'igads_reach', label: 'Alcance', value: 22890, format: 'number', change: 19.7, previousValue: 19120, channel: 'instagram_ads' } },
  },
  {
    id: uid(), colSpan: 1,
    config: { type: 'kpi_card', data: { metricKey: 'igads_clicks', label: 'Clics', value: 2341, format: 'number', change: 5.8, previousValue: 2213, channel: 'instagram_ads' } },
  },
  {
    id: uid(), colSpan: 1,
    config: { type: 'kpi_card', data: { metricKey: 'igads_cost', label: 'Costo', value: 67890, format: 'currency_ars', change: 11.2, previousValue: 61050, channel: 'instagram_ads' } },
  },
]

// ============================================================
// Análisis de texto (bloque de texto)
// ============================================================
const analysisTextBlock: ReportWidget = {
  id: uid(), colSpan: 4,
  config: {
    type: 'text_block',
    data: {
      content: `<h3>Análisis del Período</h3>
<p>Durante la primera semana de marzo, <strong>T.D.E.</strong> mostró un crecimiento significativo en alcance orgánico en Facebook (+12.5%) impulsado por el post promocional del fin de semana.</p>
<p>En <strong>Instagram</strong>, las vistas aumentaron un 34.2% gracias al formato Reels que sigue generando mayor alcance orgánico.</p>
<ul>
<li><strong>Punto fuerte:</strong> El contenido en formato video corto sigue siendo el de mayor engagement.</li>
<li><strong>Oportunidad:</strong> Incrementar la frecuencia de publicación en TikTok para recuperar métricas.</li>
<li><strong>Recomendación:</strong> Reasignar presupuesto de la campaña de Tráfico hacia Conversiones dado el mejor CPC.</li>
</ul>`,
    },
  },
}

// ============================================================
// MOCK REPORT COMPLETO
// ============================================================
export const MOCK_REPORT_SECTIONS: ReportSection[] = [
  {
    id: uid(),
    name: 'Facebook Performance',
    channel: 'facebook',
    widgets: [...facebookKPIs, facebookChart, facebookPostsTable],
  },
  {
    id: uid(),
    name: 'Instagram Performance',
    channel: 'instagram',
    widgets: [...instagramKPIs, instagramChart, instagramEngagementChart, instagramPostsTable],
  },
  {
    id: uid(),
    name: 'TikTok Performance',
    channel: 'tiktok',
    widgets: [...tiktokKPIs, tiktokPostsTable],
  },
  {
    id: uid(),
    name: 'LinkedIn Performance',
    channel: 'linkedin',
    widgets: [...linkedinKPIs, linkedinPostsTable],
  },
  {
    id: uid(),
    name: 'Performance Meta Ads',
    channel: 'meta_ads',
    widgets: [...metaAdsKPIs, ...metaAdsKPIs2, metaAdsChart, metaAdsPieChart, metaAdsCampaignsTable, analysisTextBlock],
  },
  {
    id: uid(),
    name: 'Performance Instagram Ads',
    channel: 'instagram_ads',
    widgets: [...igAdsKPIs],
  },
]

export const MOCK_REPORT_TITLE = 'Reporte Mensual — T.D.E. Tienda de Empanadas'
export const MOCK_DATE_FROM = '2025-03-01'
export const MOCK_DATE_TO = '2025-03-09'

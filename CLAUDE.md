# Kaizen Report Tool — Marketing Reports Engine

## Descripción del Proyecto

Kaizen Report Tool es una plataforma interna para nuestra agencia de marketing que genera reportes automatizados para clientes. Inspirada en Swydo, permite gestionar clientes, conectar fuentes de datos (Google Ads, Meta Ads, GA4, etc.), construir reportes con widgets arrastrables, y enviarlos automáticamente.

## Stack Técnico

- **Framework:** Next.js 14+ (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Base de datos:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **ORM:** Supabase JS Client (no Prisma)
- **Charts:** Recharts
- **Deploy:** Vercel
- **Control de versiones:** Git + GitHub

## Estructura del Proyecto

```
reportflow/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Rutas de autenticación
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/        # Layout principal (requiere auth)
│   │   │   ├── layout.tsx      # Sidebar + header
│   │   │   ├── page.tsx        # Dashboard principal
│   │   │   ├── clients/
│   │   │   │   ├── page.tsx    # Lista de clientes
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx # Detalle cliente
│   │   │   ├── reports/
│   │   │   │   ├── page.tsx    # Lista de reportes
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx # Builder de reportes
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx    # Editor de reporte
│   │   │   │       └── preview/
│   │   │   │           └── page.tsx # Vista previa
│   │   │   ├── templates/
│   │   │   │   └── page.tsx    # Gestión de plantillas
│   │   │   └── settings/
│   │   │       └── page.tsx    # Configuración agencia
│   │   ├── api/
│   │   │   ├── reports/
│   │   │   │   ├── generate/route.ts   # Generar reporte
│   │   │   │   └── send/route.ts       # Enviar por email
│   │   │   ├── integrations/
│   │   │   │   ├── google-ads/route.ts
│   │   │   │   ├── meta-ads/route.ts
│   │   │   │   └── analytics/route.ts
│   │   │   └── webhooks/
│   │   │       └── supabase/route.ts
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                 # Componentes base (Button, Input, Card, etc.)
│   │   ├── charts/             # Wrappers de Recharts
│   │   │   ├── AreaChartWidget.tsx
│   │   │   ├── BarChartWidget.tsx
│   │   │   ├── PieChartWidget.tsx
│   │   │   └── KPICard.tsx
│   │   ├── report-builder/     # Componentes del builder
│   │   │   ├── WidgetPalette.tsx
│   │   │   ├── ReportCanvas.tsx
│   │   │   ├── WidgetRenderer.tsx
│   │   │   └── TemplateSelector.tsx
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── MobileNav.tsx
│   │   └── shared/
│   │       ├── Badge.tsx
│   │       ├── DataTable.tsx
│   │       └── EmptyState.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts       # Cliente browser
│   │   │   ├── server.ts       # Cliente server (SSR)
│   │   │   ├── admin.ts        # Cliente admin (service role)
│   │   │   └── middleware.ts   # Auth middleware
│   │   ├── integrations/       # Conectores de APIs externas
│   │   │   ├── google-ads.ts
│   │   │   ├── meta-ads.ts
│   │   │   └── google-analytics.ts
│   │   └── utils/
│   │       ├── formatters.ts   # Formateo de números, fechas, moneda
│   │       ├── constants.ts    # Constantes globales
│   │       └── helpers.ts
│   ├── hooks/
│   │   ├── useClients.ts
│   │   ├── useReports.ts
│   │   ├── useMetrics.ts
│   │   └── useAuth.ts
│   └── types/
│       ├── database.ts         # Tipos generados de Supabase
│       ├── reports.ts
│       ├── clients.ts
│       └── metrics.ts
├── supabase/
│   ├── migrations/             # Migraciones SQL
│   │   └── 001_initial_schema.sql
│   ├── seed.sql                # Datos de prueba
│   └── config.toml
├── public/
│   └── images/
├── .env.local.example
├── CLAUDE.md                   # Este archivo
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## Convenciones de Código

### General
- Todo el código en **TypeScript** con tipos estrictos (no `any`)
- Nombres de archivos en **kebab-case** excepto componentes React (PascalCase)
- Imports absolutos usando `@/` (ej: `@/components/ui/Button`)
- Comentarios en español para lógica de negocio, inglés para código técnico
- Siempre usar `async/await`, nunca `.then()` chains

### React / Next.js
- Componentes funcionales con arrow functions
- Server Components por defecto, `"use client"` solo cuando es necesario
- Usar `loading.tsx` y `error.tsx` en cada ruta
- Data fetching en Server Components, nunca en `useEffect` para carga inicial
- Forms con Server Actions cuando sea posible

### Supabase
- Nunca exponer `service_role` key en el cliente
- Usar RLS (Row Level Security) en todas las tablas
- Queries siempre con tipado: `supabase.from('clients').select('*').returns<Client[]>()`
- Manejar errores de Supabase explícitamente: `const { data, error } = await ...`

### Estilos
- Tailwind CSS para todo, no CSS custom excepto para animaciones complejas
- Tema oscuro como default (dark mode first)
- Diseño responsive: mobile-first
- Paleta de colores definida en `tailwind.config.ts`

## Base de Datos — Tablas Principales

Ver archivo `supabase/migrations/001_initial_schema.sql` para el esquema completo.

Tablas: `agencies`, `users`, `clients`, `data_sources`, `report_templates`, `reports`, `report_widgets`, `metrics_cache`

## Variables de Entorno Requeridas

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_ADS_CLIENT_ID=
GOOGLE_ADS_CLIENT_SECRET=
META_ADS_ACCESS_TOKEN=
RESEND_API_KEY=
```

## Flujo de Trabajo Git

- `main` → producción (deploy automático en Vercel)
- `develop` → desarrollo
- Feature branches: `feat/nombre-feature`
- Fix branches: `fix/nombre-fix`
- Commits en español, formato: `tipo: descripción breve`
  - `feat: agregar selector de plantillas`
  - `fix: corregir cálculo de ROAS`
  - `refactor: extraer lógica de métricas a hook`

## Roadmap (orden de implementación)

1. ✅ Prototipo visual (hecho en Claude.ai)
2. 🔲 Setup proyecto Next.js + Supabase + Vercel
3. 🔲 Auth (login/registro con Supabase Auth)
4. 🔲 CRUD de clientes
5. 🔲 Sistema de plantillas de reportes
6. 🔲 Report builder (drag & drop de widgets)
7. 🔲 Vista previa y exportación PDF
8. 🔲 Integración Google Ads API
9. 🔲 Integración Meta Ads API
10. 🔲 Integración Google Analytics 4
11. 🔲 Envío automático por email (Resend)
12. 🔲 Scheduling de reportes (cron)
13. 🔲 White-labeling por agencia
14. 🔲 Análisis con IA (resumen automático)

## Notas Importantes

- La agencia está en Mendoza, Argentina — usar locale `es-AR` para fechas y moneda
- Los reportes deben poder mostrar métricas en USD y ARS
- El timezone default es `America/Argentina/Mendoza`
- La plataforma es multi-tenant: cada agencia ve solo sus datos
- Priorizar UX limpia y profesional — los clientes van a ver los reportes

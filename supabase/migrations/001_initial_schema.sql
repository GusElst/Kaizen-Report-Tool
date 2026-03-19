-- ============================================================
-- Kaizen Report Tool — Schema Inicial
-- Migración: 001_initial_schema.sql
-- ============================================================
-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para búsqueda fuzzy

-- ============================================================
-- ENUM TYPES
-- ============================================================
CREATE TYPE client_status AS ENUM ('active', 'paused', 'archived');
CREATE TYPE data_source_type AS ENUM ('google_ads', 'meta_ads', 'google_analytics', 'search_console', 'email_marketing', 'linkedin_ads', 'manual');
CREATE TYPE report_status AS ENUM ('draft', 'generated', 'sent', 'scheduled');
CREATE TYPE widget_type AS ENUM ('kpi_card', 'line_chart', 'bar_chart', 'area_chart', 'pie_chart', 'data_table', 'text_block', 'comparison', 'funnel');
CREATE TYPE schedule_frequency AS ENUM ('weekly', 'biweekly', 'monthly', 'quarterly');
CREATE TYPE currency_type AS ENUM ('USD', 'ARS');

-- ============================================================
-- AGENCIES (multi-tenant root)
-- ============================================================
CREATE TABLE agencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    primary_color TEXT DEFAULT '#f26c09',
    secondary_color TEXT DEFAULT '#27333d',
    contact_email TEXT,
    website TEXT,
    timezone TEXT DEFAULT 'America/Argentina/Mendoza',
    default_currency currency_type DEFAULT 'USD',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- USERS (vinculados a Supabase Auth)
-- ============================================================
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_users_agency ON users(agency_id);

-- ============================================================
-- CLIENTS
-- ============================================================
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    industry TEXT,
    logo_url TEXT,
    brand_color TEXT DEFAULT '#f26c09',
    contact_name TEXT,
    contact_email TEXT,
    website TEXT,
    notes TEXT,
    currency currency_type DEFAULT 'USD',
    status client_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(agency_id, slug)
);
CREATE INDEX idx_clients_agency ON clients(agency_id);
CREATE INDEX idx_clients_status ON clients(agency_id, status);
CREATE INDEX idx_clients_name_trgm ON clients USING gin(name gin_trgm_ops);

-- ============================================================
-- DATA SOURCES (conexiones a APIs por cliente)
-- ============================================================
CREATE TABLE data_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    source_type data_source_type NOT NULL,
    display_name TEXT NOT NULL,
    credentials JSONB DEFAULT '{}',
    config JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMPTZ,
    last_sync_status TEXT,
    last_sync_error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_data_sources_client ON data_sources(client_id);
CREATE INDEX idx_data_sources_type ON data_sources(source_type);

-- ============================================================
-- REPORT TEMPLATES
-- ============================================================
CREATE TABLE report_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    default_widgets JSONB DEFAULT '[]',
    layout_config JSONB DEFAULT '{}',
    is_shared BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_templates_agency ON report_templates(agency_id);

-- ============================================================
-- REPORTS
-- ============================================================
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    template_id UUID REFERENCES report_templates(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    status report_status DEFAULT 'draft',
    date_from DATE NOT NULL,
    date_to DATE NOT NULL,
    config JSONB DEFAULT '{}',
    public_url TEXT,
    public_token TEXT UNIQUE,
    sent_at TIMESTAMPTZ,
    sent_to TEXT[],
    opened_at TIMESTAMPTZ,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_reports_agency ON reports(agency_id);
CREATE INDEX idx_reports_client ON reports(client_id);
CREATE INDEX idx_reports_status ON reports(agency_id, status);
CREATE INDEX idx_reports_dates ON reports(date_from, date_to);
CREATE INDEX idx_reports_public_token ON reports(public_token) WHERE public_token IS NOT NULL;

-- ============================================================
-- REPORT WIDGETS
-- ============================================================
CREATE TABLE report_widgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    widget_type widget_type NOT NULL,
    title TEXT,
    position_order INTEGER NOT NULL DEFAULT 0,
    grid_col_span INTEGER DEFAULT 1 CHECK (grid_col_span BETWEEN 1 AND 4),
    config JSONB DEFAULT '{}',
    cached_data JSONB,
    cached_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_widgets_report ON report_widgets(report_id);
CREATE INDEX idx_widgets_order ON report_widgets(report_id, position_order);

-- ============================================================
-- METRICS CACHE
-- ============================================================
CREATE TABLE metrics_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    data_source_id UUID NOT NULL REFERENCES data_sources(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    impressions BIGINT DEFAULT 0,
    clicks BIGINT DEFAULT 0,
    conversions NUMERIC(12,2) DEFAULT 0,
    cost NUMERIC(12,2) DEFAULT 0,
    revenue NUMERIC(12,2) DEFAULT 0,
    ctr NUMERIC(8,4),
    cpc NUMERIC(12,4),
    cpa NUMERIC(12,4),
    roas NUMERIC(8,4),
    extra_metrics JSONB DEFAULT '{}',
    campaign_name TEXT,
    ad_group_name TEXT,
    channel TEXT,
    device TEXT,
    country TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(data_source_id, metric_date, campaign_name, ad_group_name, device, country)
);
CREATE INDEX idx_metrics_client ON metrics_cache(client_id);
CREATE INDEX idx_metrics_source ON metrics_cache(data_source_id);
CREATE INDEX idx_metrics_date ON metrics_cache(client_id, metric_date);
CREATE INDEX idx_metrics_date_range ON metrics_cache(client_id, metric_date DESC);
CREATE INDEX idx_metrics_channel ON metrics_cache(client_id, channel, metric_date);

-- ============================================================
-- REPORT SCHEDULES
-- ============================================================
CREATE TABLE report_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES report_templates(id) ON DELETE CASCADE,
    frequency schedule_frequency NOT NULL,
    send_day INTEGER DEFAULT 1,
    send_hour INTEGER DEFAULT 9 CHECK (send_hour BETWEEN 0 AND 23),
    recipients TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    include_pdf BOOLEAN DEFAULT true,
    custom_subject TEXT,
    custom_message TEXT,
    last_sent_at TIMESTAMPTZ,
    next_send_at TIMESTAMPTZ,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_schedules_agency ON report_schedules(agency_id);
CREATE INDEX idx_schedules_next ON report_schedules(next_send_at) WHERE is_active = true;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_schedules ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION get_user_agency_id()
RETURNS UUID AS $$
    SELECT agency_id FROM users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE POLICY "Users can view own agency" ON agencies FOR SELECT USING (id = get_user_agency_id());
CREATE POLICY "Owners can update agency" ON agencies FOR UPDATE USING (id = get_user_agency_id() AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('owner', 'admin')));

CREATE POLICY "Users can view agency members" ON users FOR SELECT USING (agency_id = get_user_agency_id());
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Agency members can view clients" ON clients FOR SELECT USING (agency_id = get_user_agency_id());
CREATE POLICY "Agency members can insert clients" ON clients FOR INSERT WITH CHECK (agency_id = get_user_agency_id());
CREATE POLICY "Agency members can update clients" ON clients FOR UPDATE USING (agency_id = get_user_agency_id());
CREATE POLICY "Admins can delete clients" ON clients FOR DELETE USING (agency_id = get_user_agency_id() AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('owner', 'admin')));

CREATE POLICY "Agency members can view data sources" ON data_sources FOR SELECT USING (agency_id = get_user_agency_id());
CREATE POLICY "Agency members can manage data sources" ON data_sources FOR ALL USING (agency_id = get_user_agency_id());

CREATE POLICY "Agency members can view templates" ON report_templates FOR SELECT USING (agency_id = get_user_agency_id());
CREATE POLICY "Agency members can manage templates" ON report_templates FOR ALL USING (agency_id = get_user_agency_id());

CREATE POLICY "Agency members can view reports" ON reports FOR SELECT USING (agency_id = get_user_agency_id());
CREATE POLICY "Agency members can manage reports" ON reports FOR ALL USING (agency_id = get_user_agency_id());
CREATE POLICY "Public can view shared reports" ON reports FOR SELECT USING (public_token IS NOT NULL AND status = 'sent');

CREATE POLICY "Agency members can view widgets" ON report_widgets FOR SELECT USING (EXISTS (SELECT 1 FROM reports WHERE reports.id = report_widgets.report_id AND reports.agency_id = get_user_agency_id()));
CREATE POLICY "Agency members can manage widgets" ON report_widgets FOR ALL USING (EXISTS (SELECT 1 FROM reports WHERE reports.id = report_widgets.report_id AND reports.agency_id = get_user_agency_id()));

CREATE POLICY "Agency members can view metrics" ON metrics_cache FOR SELECT USING (EXISTS (SELECT 1 FROM clients WHERE clients.id = metrics_cache.client_id AND clients.agency_id = get_user_agency_id()));
CREATE POLICY "Agency members can manage metrics" ON metrics_cache FOR ALL USING (EXISTS (SELECT 1 FROM clients WHERE clients.id = metrics_cache.client_id AND clients.agency_id = get_user_agency_id()));

CREATE POLICY "Agency members can view schedules" ON report_schedules FOR SELECT USING (agency_id = get_user_agency_id());
CREATE POLICY "Agency members can manage schedules" ON report_schedules FOR ALL USING (agency_id = get_user_agency_id());

-- ============================================================
-- TRIGGERS updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON agencies FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON data_sources FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON report_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON report_widgets FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON report_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- FUNCIONES ÚTILES
-- ============================================================
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(regexp_replace(regexp_replace(translate(input_text, 'áéíóúñÁÉÍÓÚÑ', 'aeiounAEIOUN'), '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION get_client_metrics_summary(p_client_id UUID, p_date_from DATE, p_date_to DATE)
RETURNS TABLE (total_impressions BIGINT, total_clicks BIGINT, total_conversions NUMERIC, total_cost NUMERIC, total_revenue NUMERIC, avg_ctr NUMERIC, avg_cpc NUMERIC, avg_cpa NUMERIC, avg_roas NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(SUM(mc.impressions), 0)::BIGINT,
        COALESCE(SUM(mc.clicks), 0)::BIGINT,
        COALESCE(SUM(mc.conversions), 0),
        COALESCE(SUM(mc.cost), 0),
        COALESCE(SUM(mc.revenue), 0),
        CASE WHEN SUM(mc.impressions) > 0 THEN ROUND(SUM(mc.clicks)::NUMERIC / SUM(mc.impressions) * 100, 2) ELSE 0 END,
        CASE WHEN SUM(mc.clicks) > 0 THEN ROUND(SUM(mc.cost) / SUM(mc.clicks), 2) ELSE 0 END,
        CASE WHEN SUM(mc.conversions) > 0 THEN ROUND(SUM(mc.cost) / SUM(mc.conversions), 2) ELSE 0 END,
        CASE WHEN SUM(mc.cost) > 0 THEN ROUND(SUM(mc.revenue) / SUM(mc.cost), 2) ELSE 0 END
    FROM metrics_cache mc
    WHERE mc.client_id = p_client_id AND mc.metric_date BETWEEN p_date_from AND p_date_to;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION get_client_metrics_comparison(p_client_id UUID, p_date_from DATE, p_date_to DATE)
RETURNS TABLE (metric_name TEXT, current_value NUMERIC, previous_value NUMERIC, change_pct NUMERIC) AS $$
DECLARE
    period_days INTEGER;
    prev_from DATE;
    prev_to DATE;
BEGIN
    period_days := p_date_to - p_date_from;
    prev_to := p_date_from - 1;
    prev_from := prev_to - period_days;
    RETURN QUERY
    WITH current_period AS (
        SELECT COALESCE(SUM(impressions),0) AS imp, COALESCE(SUM(clicks),0) AS clk, COALESCE(SUM(conversions),0) AS conv, COALESCE(SUM(cost),0) AS cst, COALESCE(SUM(revenue),0) AS rev
        FROM metrics_cache WHERE client_id = p_client_id AND metric_date BETWEEN p_date_from AND p_date_to
    ),
    previous_period AS (
        SELECT COALESCE(SUM(impressions),0) AS imp, COALESCE(SUM(clicks),0) AS clk, COALESCE(SUM(conversions),0) AS conv, COALESCE(SUM(cost),0) AS cst, COALESCE(SUM(revenue),0) AS rev
        FROM metrics_cache WHERE client_id = p_client_id AND metric_date BETWEEN prev_from AND prev_to
    )
    SELECT 'impressions', c.imp::NUMERIC, p.imp::NUMERIC, CASE WHEN p.imp > 0 THEN ROUND((c.imp - p.imp)::NUMERIC / p.imp * 100, 1) ELSE 0 END FROM current_period c, previous_period p
    UNION ALL SELECT 'clicks', c.clk::NUMERIC, p.clk::NUMERIC, CASE WHEN p.clk > 0 THEN ROUND((c.clk - p.clk)::NUMERIC / p.clk * 100, 1) ELSE 0 END FROM current_period c, previous_period p
    UNION ALL SELECT 'conversions', c.conv, p.conv, CASE WHEN p.conv > 0 THEN ROUND((c.conv - p.conv) / p.conv * 100, 1) ELSE 0 END FROM current_period c, previous_period p
    UNION ALL SELECT 'cost', c.cst, p.cst, CASE WHEN p.cst > 0 THEN ROUND((c.cst - p.cst) / p.cst * 100, 1) ELSE 0 END FROM current_period c, previous_period p
    UNION ALL SELECT 'revenue', c.rev, p.rev, CASE WHEN p.rev > 0 THEN ROUND((c.rev - p.rev) / p.rev * 100, 1) ELSE 0 END FROM current_period c, previous_period p;
END;
$$ LANGUAGE plpgsql STABLE;

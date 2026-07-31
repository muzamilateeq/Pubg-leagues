-- ==========================================
-- PUBG TOURNAMENT MANAGEMENT SYSTEM SCHEMA
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SEASONS TABLE
CREATE TABLE IF NOT EXISTS public.seasons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TEAMS TABLE
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season_id UUID REFERENCES public.seasons(id) ON DELETE CASCADE,
    team_name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    captain_name VARCHAR(255),
    contact VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. MATCHES TABLE
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season_id UUID REFERENCES public.seasons(id) ON DELETE CASCADE,
    match_number INT NOT NULL,
    map_name VARCHAR(100) NOT NULL DEFAULT 'Erangel',
    match_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    status VARCHAR(50) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed', 'draft')),
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. MATCH RESULTS TABLE
CREATE TABLE IF NOT EXISTS public.match_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    placement_rank INT NOT NULL CHECK (placement_rank >= 1 AND placement_rank <= 64),
    placement_points INT NOT NULL DEFAULT 0,
    kill_points INT NOT NULL DEFAULT 0,
    total_points INT GENERATED ALWAYS AS (placement_points + kill_points) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_match_team UNIQUE(match_id, team_id),
    CONSTRAINT unique_match_rank UNIQUE(match_id, placement_rank)
);

-- Realtime Setup
ALTER PUBLICATION supabase_realtime ADD TABLE public.seasons;
ALTER PUBLICATION supabase_realtime ADD TABLE public.teams;
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.match_results;

-- Row Level Security (RLS) Policies
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_results ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all tables
CREATE POLICY "Public Read Seasons" ON public.seasons FOR SELECT USING (true);
CREATE POLICY "Public Read Teams" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Public Read Matches" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Public Read Match Results" ON public.match_results FOR SELECT USING (true);

-- Allow authenticated or anon write access (for demo admin flexibility)
CREATE POLICY "Allow All Insert Seasons" ON public.seasons FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow All Update Seasons" ON public.seasons FOR UPDATE USING (true);
CREATE POLICY "Allow All Delete Seasons" ON public.seasons FOR DELETE USING (true);

CREATE POLICY "Allow All Insert Teams" ON public.teams FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow All Update Teams" ON public.teams FOR UPDATE USING (true);
CREATE POLICY "Allow All Delete Teams" ON public.teams FOR DELETE USING (true);

CREATE POLICY "Allow All Insert Matches" ON public.matches FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow All Update Matches" ON public.matches FOR UPDATE USING (true);
CREATE POLICY "Allow All Delete Matches" ON public.matches FOR DELETE USING (true);

CREATE POLICY "Allow All Insert Match Results" ON public.match_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow All Update Match Results" ON public.match_results FOR UPDATE USING (true);
CREATE POLICY "Allow All Delete Match Results" ON public.match_results FOR DELETE USING (true);

-- ==========================================
-- SEED DATA FOR QUICK START
-- ==========================================

DO $$
DECLARE
    v_season_id UUID;
    v_team1_id UUID;
    v_team2_id UUID;
    v_team3_id UUID;
    v_team4_id UUID;
    v_team5_id UUID;
    v_match1_id UUID;
    v_match2_id UUID;
BEGIN
    -- Create Season 1
    INSERT INTO public.seasons (name, status)
    VALUES ('PMSC Season 1 - Global Championship', 'active')
    RETURNING id INTO v_season_id;

    -- Create Teams
    INSERT INTO public.teams (season_id, team_name, logo_url, captain_name, contact)
    VALUES (v_season_id, 'FaZe Clan', 'https://api.dicebear.com/7.x/identicon/svg?seed=faze', 'Inonix', 'faze@esports.com')
    RETURNING id INTO v_team1_id;

    INSERT INTO public.teams (season_id, team_name, logo_url, captain_name, contact)
    VALUES (v_season_id, 'Natus Vincere', 'https://api.dicebear.com/7.x/identicon/svg?seed=navi', 'ubah', 'navi@esports.com')
    RETURNING id INTO v_team2_id;

    INSERT INTO public.teams (season_id, team_name, logo_url, captain_name, contact)
    VALUES (v_season_id, '17 Gaming', 'https://api.dicebear.com/7.x/identicon/svg?seed=17gaming', 'LilGhost', '17g@esports.com')
    RETURNING id INTO v_team3_id;

    INSERT INTO public.teams (season_id, team_name, logo_url, captain_name, contact)
    VALUES (v_season_id, 'Soniqs', 'https://api.dicebear.com/7.x/identicon/svg?seed=soniqs', 'hwinn', 'soniqs@esports.com')
    RETURNING id INTO v_team4_id;

    INSERT INTO public.teams (season_id, team_name, logo_url, captain_name, contact)
    VALUES (v_season_id, 'Twisted Minds', 'https://api.dicebear.com/7.x/identicon/svg?seed=twisted', 'BatulinS', 'tm@esports.com')
    RETURNING id INTO v_team5_id;

    -- Create Match 1 (Completed)
    INSERT INTO public.matches (season_id, match_number, map_name, status)
    VALUES (v_season_id, 1, 'Erangel', 'completed')
    RETURNING id INTO v_match1_id;

    -- Create Match 2 (Completed)
    INSERT INTO public.matches (season_id, match_number, map_name, status)
    VALUES (v_season_id, 2, 'Miramar', 'completed')
    RETURNING id INTO v_match2_id;

    -- Create Match 1 Results
    INSERT INTO public.match_results (match_id, team_id, placement_rank, placement_points, kill_points) VALUES
    (v_match1_id, v_team1_id, 1, 10, 12), -- FaZe WWCD
    (v_match1_id, v_team2_id, 2, 6, 8),   -- NAVI
    (v_match1_id, v_team3_id, 3, 5, 4),   -- 17 Gaming
    (v_match1_id, v_team4_id, 4, 4, 3),   -- Soniqs
    (v_match1_id, v_team5_id, 5, 3, 2);   -- Twisted Minds

    -- Create Match 2 Results
    INSERT INTO public.match_results (match_id, team_id, placement_rank, placement_points, kill_points) VALUES
    (v_match2_id, v_team3_id, 1, 10, 14), -- 17 Gaming WWCD
    (v_match2_id, v_team5_id, 2, 6, 9),   -- Twisted Minds
    (v_match2_id, v_team1_id, 3, 5, 7),   -- FaZe Clan
    (v_match2_id, v_team4_id, 4, 4, 6),   -- Soniqs
    (v_match2_id, v_team2_id, 5, 3, 4);   -- NAVI
END $$;

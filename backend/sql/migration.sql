-- ============================================================
-- AI Contract Explainer - Supabase Schema Migration
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- 1. Extend existing contracts table
ALTER TABLE contracts
  ADD COLUMN IF NOT EXISTS extracted_text text,
  ADD COLUMN IF NOT EXISTS document_type text,
  ADD COLUMN IF NOT EXISTS text_length integer;

-- 2. Create analyses table
CREATE TABLE IF NOT EXISTS analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid REFERENCES contracts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type text,
  summary text,
  risk_score integer DEFAULT 0,
  status text DEFAULT 'processing',
  error_message text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analyses_contract ON analyses(contract_id);
CREATE INDEX IF NOT EXISTS idx_analyses_user ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_status ON analyses(status);

-- 3. Create clauses table
CREATE TABLE IF NOT EXISTS clauses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid REFERENCES analyses(id) ON DELETE CASCADE,
  title text NOT NULL,
  original_text text,
  simple_explanation text,
  risk_level text DEFAULT 'Medium',
  risk_reason text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_clauses_analysis ON clauses(analysis_id);

-- 4. Create risk_factors table
CREATE TABLE IF NOT EXISTS risk_factors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid REFERENCES analyses(id) ON DELETE CASCADE,
  factor_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_risk_factors_analysis ON risk_factors(analysis_id);

-- 5. Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid REFERENCES analyses(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  context text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_questions_analysis ON questions(analysis_id);

-- 6. Enable Row Level Security
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE clauses ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies (users can only read their own data)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users read own analyses') THEN
    CREATE POLICY "Users read own analyses"
      ON analyses FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users read own clauses') THEN
    CREATE POLICY "Users read own clauses"
      ON clauses FOR SELECT
      USING (analysis_id IN (SELECT id FROM analyses WHERE user_id = auth.uid()));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users read own risk_factors') THEN
    CREATE POLICY "Users read own risk_factors"
      ON risk_factors FOR SELECT
      USING (analysis_id IN (SELECT id FROM analyses WHERE user_id = auth.uid()));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users read own questions') THEN
    CREATE POLICY "Users read own questions"
      ON questions FOR SELECT
      USING (analysis_id IN (SELECT id FROM analyses WHERE user_id = auth.uid()));
  END IF;
END
$$;

-- ============================================================
-- Done! Tahe service_role key used by the backend bypasses RLS.
-- ============================================================

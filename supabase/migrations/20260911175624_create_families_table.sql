/*
# Create families table and auth trigger

1. New Tables
   - `families`
     - `id` (uuid, primary key, references auth.users)
     - `created_at` (timestamptz)
     - `subscription_status` (text, default 'free')

2. Security
   - Enable RLS on `families`
   - Owner-scoped CRUD: each authenticated user can only access their own family row

3. Auth Trigger
   - `on_auth_user_created`: automatically creates a `families` row when a new user signs up
*/

-- Families table: one row per parent/guardian account
CREATE TABLE IF NOT EXISTS families (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  subscription_status text NOT NULL DEFAULT 'free'
);

ALTER TABLE families ENABLE ROW LEVEL SECURITY;

-- RLS policies: each user sees only their own family
DROP POLICY IF EXISTS "select_own_family" ON families;
CREATE POLICY "select_own_family" ON families FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_family" ON families;
CREATE POLICY "insert_own_family" ON families FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_family" ON families;
CREATE POLICY "update_own_family" ON families FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_family" ON families;
CREATE POLICY "delete_own_family" ON families FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- Trigger: auto-create a family row when a new user signs up
CREATE OR REPLACE FUNCTION public.on_auth_user_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.families (id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.on_auth_user_created();

/*
# Add admin access control

1. Changes
- Added `is_admin` boolean column to `families` table (defaults to false).
- Added `is_admin_session()` SECURITY DEFINER function that checks if the
  current authenticated user has `is_admin = true` in `families`.
- The function is callable by authenticated users only.

2. Security
- `is_admin` column is NOT writable by clients. UPDATE privilege on
  `families` is revoked from authenticated; only the owner can still
  read their own row via the existing SELECT policy.
- `is_admin_session()` derives the caller from `auth.uid()` — a parameter
  cannot forge admin status.
- EXECUTE revoked from anon.

3. Usage
- The frontend calls `supabase.rpc('is_admin_session')` after login.
- If it returns `true`, the app bypasses all story locks.
- To grant admin: run `UPDATE families SET is_admin = true WHERE id = '<uuid>'`
  using the service-role key or Supabase dashboard.
*/

ALTER TABLE families
  ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

-- Revoke client writes on the admin column (and the whole table UPDATE
-- since families should not be directly mutable by clients anyway).
REVOKE UPDATE ON families FROM authenticated;
REVOKE UPDATE ON families FROM anon;

CREATE OR REPLACE FUNCTION is_admin_session()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM families
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION is_admin_session FROM anon;
GRANT EXECUTE ON FUNCTION is_admin_session TO authenticated;

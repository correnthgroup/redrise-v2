-- Migration 046: organization projects gated by Corporate plan

CREATE TABLE IF NOT EXISTS public.projects (
  id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_active_corporate_plan(target_owner_user_id uuid)
RETURNS boolean AS $$
BEGIN
  IF target_owner_user_id IS NULL THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.billing_subscriptions subscription
    WHERE subscription.owner_user_id = target_owner_user_id
      AND subscription.plan = 'corporate'
      AND subscription.status IN ('active', 'trialing')
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.has_active_corporate_plan(uuid) TO authenticated;

DROP POLICY IF EXISTS "Role scoped users can view projects" ON public.projects;
CREATE POLICY "Role scoped users can view projects"
  ON public.projects FOR SELECT
  USING (public.can_view_user_scoped_data(user_id));

DROP POLICY IF EXISTS "Corporate role scoped users can insert projects" ON public.projects;
CREATE POLICY "Corporate role scoped users can insert projects"
  ON public.projects FOR INSERT
  WITH CHECK (
    public.can_manage_user_scoped_data(user_id)
    AND public.has_active_corporate_plan(user_id)
  );

DROP POLICY IF EXISTS "Corporate role scoped users can update projects" ON public.projects;
CREATE POLICY "Corporate role scoped users can update projects"
  ON public.projects FOR UPDATE
  USING (
    public.can_manage_user_scoped_data(user_id)
    AND public.has_active_corporate_plan(user_id)
  )
  WITH CHECK (
    public.can_manage_user_scoped_data(user_id)
    AND public.has_active_corporate_plan(user_id)
  );

DROP POLICY IF EXISTS "Corporate role scoped users can delete projects" ON public.projects;
CREATE POLICY "Corporate role scoped users can delete projects"
  ON public.projects FOR DELETE
  USING (
    public.can_manage_user_scoped_data(user_id)
    AND public.has_active_corporate_plan(user_id)
  );

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);

CREATE OR REPLACE FUNCTION public.touch_projects_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS trg_projects_updated_at ON public.projects;
CREATE TRIGGER trg_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.touch_projects_updated_at();

-- Add duration and closes_at to issue table
ALTER TABLE public.issue
  ADD COLUMN IF NOT EXISTS duration text CHECK (duration IN ('1_week', '3_months', '6_months', 'forever')) DEFAULT 'forever',
  ADD COLUMN IF NOT EXISTS closes_at timestamptz;

-- Register module (enabled by default)
INSERT INTO public.module (key, number, name, description, group_key, group_name, admin_enabled, user_configurable)
VALUES ('topic_duration', 105, 'Topic Duration', 'Set how long a topic stays open (1 week, 3 months, 6 months, forever) with a visual timeline', 'H', 'Process & Lifecycle', true, false)
ON CONFLICT (key) DO UPDATE SET admin_enabled = true;

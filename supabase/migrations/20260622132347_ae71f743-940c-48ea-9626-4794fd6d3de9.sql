
-- 1) Bookings table: remove public read; tighten anonymous insert with a meaningful check
DROP POLICY IF EXISTS "Anyone can read bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;

-- Re-grant: bookings are written anonymously via the public form, read only by service role (edge functions)
REVOKE SELECT ON public.bookings FROM anon, authenticated;
GRANT INSERT ON public.bookings TO anon, authenticated;
GRANT ALL ON public.bookings TO service_role;

CREATE POLICY "Public can submit bookings with consent"
  ON public.bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    disclaimer_agreed = true
    AND details_agreed = true
    AND length(trim(client_name)) > 0
    AND length(trim(email)) > 0
    AND length(trim(booking_number)) > 0
  );

CREATE POLICY "Service role can read bookings"
  ON public.bookings
  FOR SELECT
  TO service_role
  USING (true);

-- 2) Storage policies: drop public read/list and the over-broad upload policy; scope uploads to known prefixes
DROP POLICY IF EXISTS "Anyone can view booking files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload booking files" ON storage.objects;

-- Only the service role (used by edge functions) can read booking files.
CREATE POLICY "Service role can read booking files"
  ON storage.objects
  FOR SELECT
  TO service_role
  USING (bucket_id = 'booking-files');

-- Anonymous form submissions may upload, but only into the expected receipts/ or themes/ prefixes.
CREATE POLICY "Public can upload booking files to scoped folders"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    bucket_id = 'booking-files'
    AND (
      name LIKE 'receipts/%'
      OR name LIKE 'themes/%'
    )
  );

-- 3) Lock down SECURITY DEFINER email-queue helpers and pin their search_path.
-- They are only invoked by the process-email-queue edge function (service role).
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_email(text, bigint) TO service_role;

ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pgmq;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pgmq;

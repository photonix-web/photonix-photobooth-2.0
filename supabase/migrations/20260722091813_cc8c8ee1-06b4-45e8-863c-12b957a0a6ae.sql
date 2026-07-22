
-- 1. Lock down SECURITY DEFINER helpers to service_role only
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.email_queue_dispatch() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.email_queue_wake() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_email(text, bigint) TO service_role;
GRANT EXECUTE ON FUNCTION public.email_queue_dispatch() TO service_role;
GRANT EXECUTE ON FUNCTION public.email_queue_wake() TO service_role;

-- 2. Scope public booking inserts: add server-side validation
DROP POLICY IF EXISTS "Public can submit bookings with consent" ON public.bookings;
CREATE POLICY "Public can submit validated bookings"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (
  disclaimer_agreed = true
  AND details_agreed = true
  AND length(btrim(client_name)) BETWEEN 2 AND 120
  AND length(btrim(booking_number)) BETWEEN 4 AND 40
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND length(email) <= 254
  AND length(btrim(phone)) BETWEEN 5 AND 30
);

-- 3. Scope storage inserts: require UUID-prefixed filenames under receipts/ or themes/
DROP POLICY IF EXISTS "Public can upload booking files to scoped folders" ON storage.objects;
CREATE POLICY "Public can upload uuid-prefixed booking files"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'booking-files'
  AND owner IS NULL
  AND name ~ '^(receipts|themes)/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-[^/]{1,200}$'
);

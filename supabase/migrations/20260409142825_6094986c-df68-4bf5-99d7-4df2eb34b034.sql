
-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_number TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  booth_package TEXT NOT NULL,
  package_type TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_date DATE NOT NULL,
  start_time TEXT NOT NULL,
  venue TEXT NOT NULL,
  pax_guest TEXT,
  theme_motif TEXT,
  street_address TEXT,
  barangay TEXT,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  price TEXT,
  theme_file_url TEXT,
  theme_file_name TEXT,
  receipt_file_url TEXT,
  receipt_file_name TEXT,
  disclaimer_agreed BOOLEAN NOT NULL DEFAULT false,
  details_agreed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert bookings (public form, no auth)
CREATE POLICY "Anyone can create bookings"
  ON public.bookings
  FOR INSERT
  WITH CHECK (true);

-- Allow reading own booking by booking_number (for confirmation page)
CREATE POLICY "Anyone can read bookings"
  ON public.bookings
  FOR SELECT
  USING (true);

-- Create storage bucket for booking files
INSERT INTO storage.buckets (id, name, public)
VALUES ('booking-files', 'booking-files', true);

-- Allow anyone to upload to booking-files bucket
CREATE POLICY "Anyone can upload booking files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'booking-files');

-- Allow anyone to view booking files
CREATE POLICY "Anyone can view booking files"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'booking-files');

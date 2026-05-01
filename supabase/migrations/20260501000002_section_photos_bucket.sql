-- Storage bucket for section photo attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('section-photos', 'section-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload
CREATE POLICY "section_photos_upload" ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'section-photos');

-- Allow public read
CREATE POLICY "section_photos_read" ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'section-photos');

-- Allow owner to delete
CREATE POLICY "section_photos_delete" ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'section-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

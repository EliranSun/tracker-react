import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://otlkqlgtytznkoyznznn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90bGtxbGd0eXR6bmtveXpuem5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQzMzYwMjAsImV4cCI6MjAwOTkxMjAyMH0.02v7rS-lI7vgn0q_Fr5y9Av-1tuw-k-TWviJkQpNGhU"
);


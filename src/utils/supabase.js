import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export const supabase = createClient(
  "https://otlkqlgtytznkoyznznn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90bGtxbGd0eXR6bmtveXpuem5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQzMzYwMjAsImV4cCI6MjAwOTkxMjAyMH0.02v7rS-lI7vgn0q_Fr5y9Av-1tuw-k-TWviJkQpNGhU"
);

export const useLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: 'piro27@gmail.com',
      options: {
        emailRedirectTo: 'https://eliransun.github.io/tracker/',
      },
    })
  };
  
  useEffect(() => {
    supabase.auth.getUser().then((response) => {
      if (response.data.user) {
        setIsLoggedIn(true);
      }
    });
  }, []);
  
  return {
    isLoggedIn,
    login
  };
}
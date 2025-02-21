
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = 'https://zcyzaeikkdjgtxsfrulg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjeXphZWlra2RqZ3R4c2ZydWxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNzY4OTMsImV4cCI6MjA1NTc1Mjg5M30.4jZVyxfQO7zkWkXhdEZhqYP8wWGYcN2yjsF6YvfNvew';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    `Les variables d'environnement Supabase sont manquantes : ${
      !supabaseUrl ? 'VITE_SUPABASE_URL' : ''
    } ${!supabaseAnonKey ? 'VITE_SUPABASE_ANON_KEY' : ''}`
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

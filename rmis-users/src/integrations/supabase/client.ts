import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ieuwkmhapggvlwbgwftm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlldXdrbWhhcGdndmx3Ymd3ZnRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1MzgxMzksImV4cCI6MjA1NDExNDEzOX0.uk6wOqWbE6P7xCtzlHX4nftfNiRoxaX6YyyWy9LOwXg";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

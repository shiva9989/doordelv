// src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czdrabvulkdyqtgelwew.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6ZHJhYnZ1bGtkeXF0Z2Vsd2V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMjkxNDMsImV4cCI6MjA1NjkwNTE0M30.p7_a0s7glCinmG_BIQBeFR5wdjPbeXn5n-1ghVeejIg';

export const supabase = createClient(supabaseUrl, supabaseKey);
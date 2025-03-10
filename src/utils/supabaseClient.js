// src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = YOUR_KEY;
const supabaseKey = YOUR_URL;

export const supabase = createClient(supabaseUrl, supabaseKey);

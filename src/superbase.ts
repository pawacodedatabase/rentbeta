// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://egjpgzctwjtmuatqkcph.supabase.co";
const supabaseKey = "sb_publishable_gph-id8bCdODrZL9HLBoUA_5jQMLoUM";

export const supabase = createClient(supabaseUrl, supabaseKey);
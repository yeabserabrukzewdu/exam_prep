import express from "express";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("API starting...");

// Supabase Configuration
let supabaseClient: any = null;

function getSupabase() {
  if (supabaseClient) return supabaseClient;

  const supabaseUrl = process.env.VITE_SUPABASE_URL || 
                     process.env.SUPABASE_URL || 
                     process.env.NEXT_PUBLIC_SUPABASE_URL || 
                     process.env.REACT_APP_SUPABASE_URL;
                     
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 
                     process.env.SUPABASE_ANON_KEY || 
                     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                     process.env.REACT_APP_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    const missing = [];
    if (!supabaseUrl) missing.push("SUPABASE_URL");
    if (!supabaseKey) missing.push("SUPABASE_ANON_KEY");
    console.error(`Missing Supabase credentials: ${missing.join(", ")}`);
    return null;
  }
  
  try {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
    return supabaseClient;
  } catch (e: any) {
    console.error("Failed to create Supabase client:", e.message);
    return null;
  }
}

const app = express();

app.use(cors());
app.use(express.json());

// API Routes

// Health check
app.get("/api/health", async (req, res) => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || 
                     process.env.SUPABASE_URL || 
                     process.env.NEXT_PUBLIC_SUPABASE_URL || 
                     process.env.REACT_APP_SUPABASE_URL;
                     
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 
                     process.env.SUPABASE_ANON_KEY || 
                     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                     process.env.REACT_APP_SUPABASE_ANON_KEY;
  
  let supabaseStatus = "not_initialized";
  let tableCheck = "not_checked";
  let errorDetail = null;
  
  try {
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      supabaseStatus = "initialized";
      const { data, error } = await supabase.from("users").select("id").limit(1);
      if (error) {
        tableCheck = "failed";
        errorDetail = error;
      } else {
        tableCheck = "success";
      }
    }
  } catch (err: any) {
    supabaseStatus = "error";
    errorDetail = err.message;
  }

  res.json({ 
    status: "ok", 
    env: { 
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseKey,
      nodeEnv: process.env.NODE_ENV
    },
    supabase: {
      status: supabaseStatus,
      tableCheck: tableCheck,
      error: errorDetail
    }
  });
});

// Get user by email
app.get("/api/users/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return res.status(500).json({ error: "Supabase client not initialized." });
    }
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) return res.status(500).json({ error: error.message });
    if (!user) return res.status(404).json({ error: "User not found" });
    
    const mappedUser = {
      ...user,
      name: user.full_name || user.id,
      lastQuizDate: user.last_quiz_date,
      progress: user.progress || []
    };
    
    if (typeof mappedUser.progress === 'string') {
      try {
        mappedUser.progress = JSON.parse(mappedUser.progress);
      } catch (e) {
        mappedUser.progress = [];
      }
    }
    
    res.json(mappedUser);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

// Signup
app.post("/api/signup", async (req, res) => {
  const { id, email, password, full_name } = req.body;
  try {
    const supabase = getSupabase();
    if (!supabase) return res.status(500).json({ error: "Supabase client not initialized." });
    
    const { data: existing, error: checkError } = await supabase
      .from("users")
      .select("id")
      .or(`id.eq.${id},email.eq.${email}`)
      .maybeSingle();

    if (checkError) return res.status(500).json({ error: checkError.message });
    if (existing) return res.status(400).json({ error: "Username or email already exists" });

    const { data: newUser, error } = await supabase
      .from("users")
      .insert([{ id, email, password, full_name, progress: [] }])
      .select()
      .maybeSingle();

    if (error) {
      if (error.message.includes('column "progress"')) {
        const { data: retryUser, error: retryError } = await supabase
          .from("users")
          .insert([{ id, email, password, full_name }])
          .select()
          .maybeSingle();
        
        if (retryError) return res.status(500).json({ error: retryError.message });
        return res.status(201).json({ ...retryUser, name: retryUser.full_name || retryUser.id, progress: [] });
      }
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ ...newUser, name: newUser.full_name || newUser.id, progress: [] });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

// Update Profile
app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { full_name, phone, streak, last_quiz_date, progress, estimated_score } = req.body;
  try {
    const supabase = getSupabase();
    if (!supabase) return res.status(500).json({ error: "Supabase client not initialized." });
    const { error } = await supabase
      .from("users")
      .update({ full_name, phone, streak, last_quiz_date, progress, estimated_score })
      .eq("id", id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// Vite middleware for local development
if (process.env.NODE_ENV !== "production" && process.env.VERCEL !== "1") {
  const PORT = 3000;
  const startDevServer = async () => {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Dev server running on http://localhost:${PORT}`);
      });
    } catch (e) {
      console.error("Failed to start Vite dev server:", e);
    }
  };
  startDevServer();
}

export default app;

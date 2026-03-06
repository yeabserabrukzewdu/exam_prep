import express from "express";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Server starting...");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("CWD:", process.cwd());

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
const PORT = 3000;

app.use(cors());
app.use(express.json());

// API Routes

// Health check to verify environment variables and Supabase connection
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
      
      // Try a simple query to verify connection and table existence
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
      nodeEnv: process.env.NODE_ENV,
      foundIn: {
        url: process.env.VITE_SUPABASE_URL ? 'VITE_SUPABASE_URL' : (process.env.SUPABASE_URL ? 'SUPABASE_URL' : 'none'),
        key: process.env.VITE_SUPABASE_ANON_KEY ? 'VITE_SUPABASE_ANON_KEY' : (process.env.SUPABASE_ANON_KEY ? 'SUPABASE_ANON_KEY' : 'none')
      }
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
  console.log(`Fetching user: ${email}`);
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return res.status(500).json({ error: "Supabase client not initialized. Check environment variables." });
    }
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    if (!user) {
      console.log(`User not found: ${email}`);
      return res.status(404).json({ error: "User not found" });
    }
    
    // Map database fields to frontend fields
    const mappedUser = {
      ...user,
      name: user.full_name || user.id,
      lastQuizDate: user.last_quiz_date,
      progress: user.progress || []
    };
    
    // Parse progress if it's a string
    if (typeof mappedUser.progress === 'string') {
      try {
        mappedUser.progress = JSON.parse(mappedUser.progress);
      } catch (e) {
        console.error("Failed to parse progress JSON:", e);
        mappedUser.progress = [];
      }
    }
    
    res.json(mappedUser);
  } catch (err: any) {
    console.error("Database error:", err.message);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

// Signup
app.post("/api/signup", async (req, res) => {
  const { id, email, password, full_name } = req.body;
  console.log(`Signup attempt: ${email} (${id})`);
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return res.status(500).json({ error: "Supabase client not initialized. Check environment variables." });
    }
    // Check if exists
    const { data: existing, error: checkError } = await supabase
      .from("users")
      .select("id")
      .or(`id.eq.${id},email.eq.${email}`)
      .maybeSingle();

    if (checkError) {
      console.error("Check existing user error:", checkError);
      return res.status(500).json({ error: checkError.message });
    }

    if (existing) {
      console.log(`User already exists: ${email} or ${id}`);
      return res.status(400).json({ error: "Username or email already exists" });
    }

    const { data: newUser, error } = await supabase
      .from("users")
      .insert([
        { 
          id, 
          email, 
          password, 
          full_name,
          progress: []
        }
      ])
      .select()
      .maybeSingle();

    if (error) {
      console.error("Insert user error:", error);
      // If progress column is missing, try inserting without it
      if (error.message.includes('column "progress" of relation "users" does not exist')) {
        const { data: retryUser, error: retryError } = await supabase
          .from("users")
          .insert([{ id, email, password, full_name }])
          .select()
          .maybeSingle();
        
        if (retryError) {
          console.error("Retry insert user error:", retryError);
          return res.status(500).json({ error: retryError.message });
        }
        
        const mappedRetryUser = {
          ...retryUser,
          name: retryUser.full_name || retryUser.id,
          progress: []
        };
        return res.status(201).json(mappedRetryUser);
      }
      return res.status(500).json({ error: error.message });
    }

    const mappedNewUser = {
      ...newUser,
      name: newUser.full_name || newUser.id,
      progress: []
    };
    res.status(201).json(mappedNewUser);
  } catch (err: any) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

// Update Profile
app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { full_name, phone, streak, last_quiz_date, progress, estimated_score } = req.body;
  console.log(`Update profile attempt: ${id}`);
  
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return res.status(500).json({ error: "Supabase client not initialized. Check environment variables." });
    }
    const { error } = await supabase
      .from("users")
      .update({
        full_name,
        phone,
        streak,
        last_quiz_date,
        progress, 
        estimated_score
      })
      .eq("id", id);

    if (error) {
      console.error("Update user error:", error);
      return res.status(500).json({ error: error.message });
    }
    res.json({ success: true });
  } catch (err: any) {
    console.error("Update error:", err.message);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

// Global error handler middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

// Vite middleware for development
if (process.env.NODE_ENV !== "production") {
  try {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error("Failed to start Vite dev server:", e);
  }
} else {
  const distPath = path.join(process.cwd(), "dist");
  console.log("Serving static files from:", distPath);
  app.use(express.static(distPath));
  app.get("*", (req, res, next) => {
    // If it's an API route that wasn't matched, don't serve index.html
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// Export for Vercel
export default app;

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");
const bodyParser = require("body-parser");
const { createClient } = require("@supabase/supabase-js");

const upload = multer(); 
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// ✅ Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ✅ AI Config (Mistral)
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_MODEL = "mistral-small"; 

// ---------------------------------------------------------
// ✅ ROUTES (Converted to Supabase)
// ---------------------------------------------------------

// 1. Fetch Study Logs
app.get("/api/study-logs/:userId", async (req, res) => {
  const { userId } = req.params;
  const today = new Date().toISOString().split("T")[0];

  try {
    // Select all logs for this user
    const { data: logs, error } = await supabase
      .from("study_logs")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;

    // Calculate Streak
    const lastStudyDate = logs.length ? logs[logs.length - 1].date : null;
    const streak = lastStudyDate === today ? logs.length : (logs.length > 0 ? 1 : 0);

    res.json({ logs, streak });
  } catch (error) {
    console.error("❌ Error fetching logs:", error.message);
    res.status(500).json({ error: "Error fetching study logs" });
  }
});

// 2. Save Study Log & Manage History (The "Move to History" Logic)
app.post("/api/study-log", async (req, res) => {
  try {
    const { userId, duration } = req.body;
    if (!userId || duration === undefined) {
      return res.status(400).json({ error: "Invalid data" });
    }

    const today = new Date().toISOString().split("T")[0];

    // A. Insert new log
    const { error: insertError } = await supabase
      .from("study_logs")
      .insert([{ user_id: userId, date: today, duration }]);
    
    if (insertError) throw insertError;

    // B. Check if we have more than 7 logs
    const { data: allLogs, error: fetchError } = await supabase
      .from("study_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true }); // Oldest first

    if (fetchError) throw fetchError;

    // Logic: Keep only the latest 7. Move the rest to history.
    if (allLogs.length > 7) {
      const logsToMove = allLogs.slice(0, allLogs.length - 7); // Get the oldest ones
      
      // 1. Prepare data for history table (remove 'id' to let history generate its own)
      const historyData = logsToMove.map(log => ({
        user_id: log.user_id,
        date: log.date,
        duration: log.duration
      }));

      // 2. Insert into History
      const { error: moveError } = await supabase
        .from("study_history")
        .insert(historyData);
      
      if (moveError) throw moveError;

      // 3. Delete from Logs
      const idsToDelete = logsToMove.map(log => log.id);
      await supabase
        .from("study_logs")
        .delete()
        .in("id", idsToDelete);
    }

    res.json({ message: "Study log updated!" });
  } catch (error) {
    console.error("❌ Error saving session:", error.message);
    res.status(500).json({ error: "Failed to save study session" });
  }
});

// 3. Fetch History
app.get("/api/study-history/:userId", async (req, res) => {
  try {
    const { data: history, error } = await supabase
      .from("study_history")
      .select("*")
      .eq("user_id", req.params.userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ history });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// 4. Delete History
app.delete("/api/study-history/:userId", async (req, res) => {
  try {
    const { error } = await supabase
      .from("study_history")
      .delete()
      .eq("user_id", req.params.userId);

    if (error) throw error;
    res.json({ message: "History deleted!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete history" });
  }
});

// ---------------------------------------------------------
// ✅ AI ROUTES (Unchanged - these work perfectly)
// ---------------------------------------------------------

app.post("/api/study-plan", async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: "Topic is required" });

    const response = await axios.post(
      "https://api.mistral.ai/v1/chat/completions",
      {
        model: MISTRAL_MODEL,
        messages: [{ role: "user", content: `Create a 7-day study plan for ${topic}.` }],
        max_tokens: 400,
      },
      { headers: { "Authorization": `Bearer ${MISTRAL_API_KEY}` } }
    );
    res.json({ plan: response.data.choices[0].message.content.trim() });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate plan" });
  }
});

app.post("/api/ask-ai", async (req, res) => {
  try {
    const { question } = req.body;
    const response = await axios.post(
      "https://api.mistral.ai/v1/chat/completions",
      {
        model: MISTRAL_MODEL,
        messages: [{ role: "user", content: question }],
        max_tokens: 300,
      },
      { headers: { "Authorization": `Bearer ${MISTRAL_API_KEY}` } }
    );
    res.json({ answer: response.data.choices[0].message.content.trim() });
  } catch (error) {
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

app.post("/api/summarize", async (req, res) => {
  try {
    const { text } = req.body;
    const response = await axios.post(
      "https://api.mistral.ai/v1/chat/completions",
      {
        model: MISTRAL_MODEL,
        messages: [{ role: "user", content: `Summarize this: ${text}` }],
      },
      { headers: { "Authorization": `Bearer ${MISTRAL_API_KEY}` } }
    );
    res.json({ summary: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "Failed to summarize" });
  }
});

app.post("/api/voice-to-text", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const formData = new FormData();
    formData.append("file", new Blob([req.file.buffer]), "audio.webm");
    formData.append("model", "whisper-1");

    const response = await axios.post(
      "https://api.mistral.ai/v1/audio/transcriptions",
      formData,
      { headers: { Authorization: `Bearer ${MISTRAL_API_KEY}`, "Content-Type": "multipart/form-data" } }
    );
    res.json({ text: response.data.text });
  } catch (error) {
    res.status(500).json({ error: "Voice-to-text failed" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
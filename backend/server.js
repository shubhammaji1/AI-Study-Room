require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const upload = multer(); // Multer for handling file uploads
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ MongoDB Schemas
const StudyLogSchema = new mongoose.Schema({
  userId: String,
  date: String,
  duration: Number,
});
const StudyHistorySchema = new mongoose.Schema({
  userId: String,
  date: String,
  duration: Number,
});

const StudyLog = mongoose.model("StudyLog", StudyLogSchema);
const StudyHistory = mongoose.model("StudyHistory", StudyHistorySchema);

// ✅ AI Config
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_MODEL = "mistral-small"; // Adjust if needed

// ✅ Fetch Study Logs
app.get("/api/study-logs/:userId", async (req, res) => {
  const { userId } = req.params;
  const today = new Date().toISOString().split("T")[0];

  try {
    const logs = await StudyLog.find({ userId });
    const lastStudyDate = logs.length ? logs[logs.length - 1].date : null;
    const streak = lastStudyDate === today ? logs.length : 1;

    res.json({ logs, streak });
  } catch (error) {
    console.error("❌ Error fetching study logs:", error);
    res.status(500).json({ error: "Error fetching study logs" });
  }
});

// ✅ Save Study Log
app.post("/api/study-log", async (req, res) => {
  try {
    const { userId, duration } = req.body;
    if (!userId || !duration) return res.status(400).json({ error: "Invalid data" });

    const today = new Date().toISOString().split("T")[0];
    const newLog = new StudyLog({ userId, date: today, duration });
    await newLog.save();

    const logs = await StudyLog.find({ userId }).sort({ date: -1 });

    if (logs.length > 7) {
      const moveToHistory = logs.slice(7);
      await StudyHistory.insertMany(moveToHistory);
      await StudyLog.deleteMany({ _id: { $in: moveToHistory.map(log => log._id) } });
    }

    res.json({ message: "Study log updated!" });
  } catch (error) {
    console.error("❌ Error saving study session:", error);
    res.status(500).json({ error: "Failed to save study session" });
  }
});

// ✅ AI-Powered Study Plan Generator
app.post("/api/study-plan", async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: "Topic is required" });

    const response = await axios.post(
      "https://api.mistral.ai/v1/chat/completions",
      {
        model: MISTRAL_MODEL,
        messages: [{ role: "user", content: `Create a 7-day study plan for ${topic}.` }],
        max_tokens: 150,
      },
      {
        headers: {
          "Authorization": `Bearer ${MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ plan: response.data.choices[0].message.content.trim() });
  } catch (error) {
    console.error("❌ Mistral API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate study plan" });
  }
});

// ✅ AI Chat (Ask AI)
app.post("/api/ask-ai", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Question is required" });

    const response = await axios.post(
      "https://api.mistral.ai/v1/chat/completions",
      {
        model: MISTRAL_MODEL,
        messages: [{ role: "user", content: question }],
        max_tokens: 200,
      },
      {
        headers: {
          "Authorization": `Bearer ${MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ answer: response.data.choices[0].message.content.trim() });
  } catch (error) {
    console.error("❌ Mistral API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

// ✅ AI Summarization
app.post("/api/summarize", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    const response = await axios.post(
      "https://api.mistral.ai/v1/chat/completions",
      {
        model: MISTRAL_MODEL,
        messages: [{ role: "user", content: `Summarize this: ${text}` }],
      },
      { 
        headers: { "Authorization": `Bearer ${MISTRAL_API_KEY}` } 
      }
    );

    const summary = response.data.choices[0]?.message?.content || "No summary available";
    res.json({ summary });
  } catch (error) {
    console.error("❌ Summarization Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to summarize text" });
  }
});

// ✅ Voice-to-Text (Mistral Whisper API)
app.post("/api/voice-to-text", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const formData = new FormData();
    formData.append("file", req.file.buffer, "audio.webm");
    formData.append("model", "whisper-1");

    const response = await axios.post(
      "https://api.mistral.ai/v1/audio/transcriptions",
      formData,
      {
        headers: {
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    res.json({ text: response.data.text });
  } catch (error) {
    console.error("❌ Voice-to-Text Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Voice-to-text conversion failed" });
  }
});

// ✅ Study History Fetch/Delete
app.get("/api/study-history/:userId", async (req, res) => {
  try {
    const historyLogs = await StudyHistory.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json({ history: historyLogs });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

app.delete("/api/study-history/:userId", async (req, res) => {
  try {
    await StudyHistory.deleteMany({ userId: req.params.userId });
    res.json({ message: "Study history deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete study history" });
  }
});

// ✅ Start the Server
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

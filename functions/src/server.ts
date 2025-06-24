// functions/src/server.ts

import express from "express";
import dotenv from "dotenv";
import { storeUserMemory, retrieveUserMemory } from "./memoryManager";
import { extractTagsFromText } from "./tag";

dotenv.config();
console.log("✅ ENV loaded:", {
  PINECONE_API_KEY: process.env.PINECONE_API_KEY ? "✅" : "❌",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ? "✅" : "❌",
});

console.log("✅ server.ts starting up");

const app = express();
app.use(express.json());

// POST /storeMemory
app.post("/storeMemory", async (req, res) => {
  console.log("📥 POST /storeMemory");
  try {
    const result = await storeUserMemory(req.body);
    res.status(200).json(result);
  } catch (err: any) {
    console.error("❌ storeMemory error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /retrieveMemory
app.post("/retrieveMemory", async (req, res) => {
  console.log("📥 POST /retrieveMemory");
  try {
    const result = await retrieveUserMemory(req.body);
    res.status(200).json({ matches: result });
  } catch (err: any) {
    console.error("❌ retrieveMemory error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /extractTags
app.post("/extractTags", async (req, res) => {
  console.log("📥 POST /extractTags");
  try {
    const tags = await extractTagsFromText(req.body.text);
    res.status(200).json({ tags });
  } catch (err: any) {
    console.error("❌ extractTags error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /ping
app.post("/ping", (req, res) => {
  console.log("✅ POST /ping triggered!");
  res.status(200).json({ message: "pong" });
});

// GET /ping (optional browser test)
app.get("/ping", (_, res) => {
  console.log("📥 GET /ping");
  res.status(200).json({ message: "pong" });
});

// GET /
app.get("/", (_, res) => {
  res.status(200).send("👋 Hello from SelahGPT server.");
});

// Start the server
const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 HTTP Function server running on port ${PORT}`);
});

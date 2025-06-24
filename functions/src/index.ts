// ✅ functions/src/index.ts — FULL SERVER ENTRY FOR CLOUD RUN
import express from "express";
import cors from "cors";
import { storeMemoryHandler, retrieveMemoryHandler } from "./memory";
export { storeMemory } from "./callable/storeMemory";

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.post("/storeMemory", storeMemoryHandler);
app.post("/retrieveMemory", retrieveMemoryHandler);

// ✅ CRITICAL: Cloud Run will inject PORT as a string — must parse it and listen
const PORT = parseInt(process.env.PORT || "8080", 10);
app.listen(PORT, () => {
  console.log(`🚀 Memory API running on port ${PORT}`);
});

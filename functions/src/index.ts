// ✅ functions/src/index.ts — Express Entry Point for HTTP Functions
import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { storeMemoryHandler, retrieveMemoryHandler } from "./memory";

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.post("/storeMemory", storeMemoryHandler);
app.post("/retrieveMemory", retrieveMemoryHandler);

export default app;

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a Mongo Atlas
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Error Mongo:", err));

// Modelo
const TelemetrySchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  timestamp: { type: String, default: () => new Date() }
});

const TelemetrySchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  timestamp: { 
    type: String, 
    default: () => new Date().toISOString().replace("T", " ").substring(0, 19)
  }
});

// Rutas
app.post("/api/telemetry", async (req, res) => { 
  try { 
    const saved = await Telemetry.create(req.body); 
    res.json({ ok: true, saved });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  } 
});

app.get("/api/telemetry", async (req, res) => {
  const data = await Telemetry.find().sort({ timestamp: -1 }).limit(100);
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor corriendo en puerto", PORT));

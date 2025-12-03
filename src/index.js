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

const Telemetry = mongoose.model("Telemetry", TelemetrySchema);

// Guardar datos
app.post("/api/telemetry", async (req, res) => {
  try {
    const saved = await Telemetry.create(req.body);
    res.json({ ok: true, saved });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// Obtener últimos datos
app.get("/api/telemetry", async (req, res) => {
  const data = await Telemetry.find().sort({ timestamp: -1 }).limit(100);
  res.json(data);
});

// ➤ NUEVA API: devuelve un tiempo random entre 4 y 60 segundos
app.get("/api/update", (req, res) => {
  const randomTime = Math.floor(Math.random() * (60 - 4 + 1)) + 4;
  res.json({ delay_seconds: randomTime });
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor corriendo en puerto", PORT));

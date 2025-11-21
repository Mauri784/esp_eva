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

/* -------------------------
   SCHEMA CORRECTO
   ------------------------- */
const TelemetrySchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,

  // Timestamp que genera el backend
  timestamp_back: { 
    type: String,
    default: () => new Date().toISOString().replace("T", " ").substring(0, 19)
  },

  // Timestamp enviado desde el ESP32
  timestamp_esp: {
    type: String
  }
}, { collection: "telemetry" });

/* -------------------------
   MODELO DEFINIDO DESPUÉS DEL SCHEMA
   ------------------------- */
const Telemetry = mongoose.model("TelemetryV2", TelemetrySchema); 
// Nombre nuevo para forzar a mongoose a recrearlo

// Rutas
app.post("/api/telemetry", async (req, res) => { 
  try { 
    const saved = await Telemetry.create({
      temperature: req.body.temperature,
      humidity: req.body.humidity,
      timestamp_esp: req.body.timestamp
    });

    res.json({ ok: true, saved });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  } 
});

app.get("/api/telemetry", async (req, res) => {
  const data = await Telemetry.find().sort({ timestamp_back: -1 }).limit(100);
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor corriendo en puerto", PORT));

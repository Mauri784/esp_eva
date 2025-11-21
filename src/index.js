import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// -------------------------
// Conexión a MongoDB Atlas
// -------------------------
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Error Mongo:", err));


// -------------------------
// Modelo (Schema primero, modelo después)
// -------------------------
const TelemetrySchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,

  // Generado por backend
  timestamp_back: {
    type: String,
    default: () => {
      const now = new Date();
      return now.toISOString().replace("T", " ").substring(0, 16);
    }
  },

  // Recibido del ESP32
  timestamp_esp: {
    type: String
  }
});

// OJO: aquí, después del schema
const Telemetry = mongoose.model("Telemetry", TelemetrySchema);


// -------------------------
// Rutas
// -------------------------
app.post("/api/telemetry", async (req, res) => {
  try {
    const saved = await Telemetry.create(req.body);
    res.json({ ok: true, saved });
  } catch (err) {
    console.error("Error al guardar:", err);
    res.status(500).json({ error: err.toString() });
  }
});

app.get("/api/telemetry", async (req, res) => {
  const data = await Telemetry.find().sort({ timestamp_back: -1 }).limit(100);
  res.json(data);
});


// -------------------------
// Servidor
// -------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor corriendo en puerto", PORT));

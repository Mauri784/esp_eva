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
// Modelo
// -------------------------
const TelemetrySchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,

  // Timestamp generado por el backend
  timestamp_back: {
    type: String,
    default: () => {
      const now = new Date();
      return now.toISOString().replace("T", " ").substring(0, 16); // YYYY-MM-DD HH:MM
    }
  },

  // Timestamp enviado desde el ESP32
  timestamp_esp: {
    type: String
  }
});

const Telemetry = mongoose.model("Telemetry", TelemetrySchema);


// -------------------------
// Rutas
// -------------------------

// POST (ESP32 envía datos)
app.post("/api/telemetry", async (req, res) => {
  try {
    const { temperature, humidity, timestamp_esp } = req.body;

    const saved = await Telemetry.create({
      temperature,
      humidity,
      timestamp_esp
    });

    res.json({ ok: true, saved });

  } catch (err) {
    console.error("Error en POST:", err);
    res.status(500).json({ error: err.toString() });
  }
});

// GET (Consultar últimos registros)
app.get("/api/telemetry", async (req, res) => {
  try {
    const data = await Telemetry.find()
      .sort({ timestamp_back: -1 })
      .limit(100);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});


// -------------------------
// Servidor
// -------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log("Servidor corriendo en puerto", PORT)
);

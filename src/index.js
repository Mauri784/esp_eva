require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const Telemetry = require("./models/Telemetry");
const app = express();

app.use(express.json());

// Conexión a MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log(" MongoDB Atlas conectado"))
  .catch((err) => console.error(" Error al conectar a Mongo:", err));

// ---------------------------------------------
//  POST: Recibir datos del ESP32
// ---------------------------------------------
app.post("/api/telemetry", async (req, res) => {
  try {
    const { temperature, humidity } = req.body;

    const data = new Telemetry({
      temperature,
      humidity,
      timestamp: new Date() // <-- solo timestamp del backend
    });

    await data.save();

    res.status(200).json({ message: "Datos guardados correctamente" });
  } catch (error) {
    console.error("Error al guardar:", error);
    res.status(500).json({ error: "Error al guardar datos" });
  }
});

// ---------------------------------------------
//  GET: Obtener datos
// ---------------------------------------------
app.get("/api/telemetry", async (req, res) => {
  try {
    const data = await Telemetry.find().sort({ timestamp: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener datos" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));

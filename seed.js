// seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Telemetry from "./src/models/Telemetry.js";

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/telemetry";

async function seed() {
  console.log("Conectando a Mongo...");
  await mongoose.connect(MONGO_URL);

  console.log("Limpiando colección...");
  await Telemetry.deleteMany();

  const now = new Date();
  const records = [];

  for (let i = 0; i < 1200; i++) {
    const timestamp = new Date(now.getTime() - i * 3 * 60 * 1000);

    records.push({
      temperature: Number((Math.random() * 10 + 20).toFixed(1)), // 20–30°C
      humidity: Number((Math.random() * 40 + 30).toFixed(1)),    // 30–70%
      timestamp: timestamp.toISOString().slice(0, 16).replace("T", " ")
    });
  }

  console.log("Insertando 1200 registros...");
  await Telemetry.insertMany(records);

  console.log("Listo. 1200 registros creados.");
  process.exit();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});

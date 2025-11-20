import mongoose from "mongoose";

const TelemetrySchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  timestamp: String
});

const Telemetry = mongoose.model("Telemetry", TelemetrySchema);

export default Telemetry;

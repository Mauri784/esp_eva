const express = require("express");
const Telemetry = require("../models/Telemetry");
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const data = await Telemetry.create(req.body);
        res.status(201).json({ message: "OK", data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/", async (req, res) => {
    const all = await Telemetry.find().sort({ timestamp: -1 });
    res.json(all);
});

module.exports = router;

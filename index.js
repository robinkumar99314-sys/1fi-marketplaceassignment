const express = require("express");
const cors = require("cors");
require("dotenv").config();

const productsRouter = require("./routes/products");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/products", productsRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`1Fi API running on http://localhost:${PORT}`));

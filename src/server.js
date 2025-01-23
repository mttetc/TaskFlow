import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import authRoute from "./routes/authRoutes.js";
import todoRoute from "./routes/todoRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// middleware
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.use("/auth", authRoute);
app.use("/todos", authMiddleware, todoRoute);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});         

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});     
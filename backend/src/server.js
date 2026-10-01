const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
path: path.resolve(__dirname, "../../.env")
});

const { initializeDatabase } = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const mindRoutes = require("./routes/mindRoutes");
const thoughtsRoutes = require("./routes/thoughtsRoutes");
const focusRoutes = require("./routes/focusRoutes");
const filterRoutes = require("./routes/filterRoutes");
const reprogramRoutes = require("./routes/reprogramRoutes");
const exploreRoutes = require("./routes/exploreRoutes");

const app = express(); // nosemgrep: javascript.express.security.audit.express-check-csurf-middleware-usage.express-check-csurf-middleware-usage -- Authenticated API requests use explicit bearer headers, not cookies.

app.use(
cors({
origin: "http://localhost:3000"
})
);

app.use(express.json());

app.get("/api/health", (req, res) => {
res.json({
status: "ok",
service: "mindos-backend"
});
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/mind", mindRoutes);
app.use("/api/thoughts", thoughtsRoutes);
app.use("/api/focus", focusRoutes);
app.use("/api/filters", filterRoutes);
app.use("/api/reprograms", reprogramRoutes);
app.use("/api/explore", exploreRoutes);

app.use((req, res) => {
res.status(404).json({
message: "Route not found"
});
});

const PORT = process.env.PORT || 5000;

async function startServer() {
try {
await initializeDatabase();

app.listen(PORT, () => {
  console.log(
    `MindOS backend running on port ${PORT}`
  );
});

} catch (error) {
console.error(
"Unable to start backend:",
error
);

process.exit(1);

}
}

startServer();
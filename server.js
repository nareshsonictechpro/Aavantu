const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require("fs");
const { Parser } = require("json2csv");

// Admin & Frontend Routers
const adminRoute = require("./src/admin/route/routers");
const frontRoute = require("./src/front/route/routes");

dotenv.config();
const PORT = process.env.PORT;

const app = express();

// ✅ Middleware: Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded files
app.use("/", express.static(path.join(__dirname, "uploads")));

// ✅ Enable CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Routes
app.use("/api/admin", adminRoute);
app.use("/api", frontRoute);

// ✅ Sample CSV Export Route
const data = [
  { id: 1, name: "John Doe", age: 30 },
  { id: 2, name: "Jane Smith", age: 25 },
  { id: 3, name: "Sam Brown", age: 35 },
  { id: 4, name: "Sams Brown", age: 35 },
];

app.get("/export-csv", (req, res) => {
  try {
    const fields = ["id", "name", "age"];
    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    const dirPath = path.join(__dirname, "/uploads/export");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(dirPath, "output.csv");
    fs.writeFileSync(filePath, csv);

    res.header("Content-Type", "text/csv");
    res.attachment("data.csv");
    return res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error exporting CSV");
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on PORT ${PORT}`);
});

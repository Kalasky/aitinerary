const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;

// import routes
const tripRoutes = require("./routes/tripRoutes");
const mapRoutes = require("./routes/mapRoutes");

// Middlewares
app.use(cors());
app.use(express.json());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something broke." });
});

// use routes
app.use("/api/trip", tripRoutes);
app.use("/api/map", mapRoutes);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  },
});

async function dbConnect() {
  try {
    await client.connect();
    const db = client.db("test");
    await db.command({ ping: 1 });
    console.log("Connected successfully to server");

    app.locals.db = db;
  } catch (error) {
    console.error("An error occurred while connecting to MongoDB", error);
  }
}

dbConnect().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

// terminate connection on process exit
process.on("SIGINT", async () => {
  await client.close();
  process.exit();
});

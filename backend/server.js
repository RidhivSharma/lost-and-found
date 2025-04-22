// backend/server.js
const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient("mongodb://127.0.0.1:27017");
const dbName = "lostAndFoundDB";

app.get("/items", async (req, res) => {
  const db = client.db(dbName);
  const items = await db.collection("items").find().toArray();
  res.json(items);
});

app.post("/items", async (req, res) => {
  const db = client.db(dbName);
  const newItem = req.body;
  const result = await db.collection("items").insertOne(newItem);
  res.json(result);
});

app.put("/items/:id/return", async (req, res) => {
  const db = client.db(dbName);
  const id = req.params.id;
  const { returnedTo } = req.body;
  const result = await db.collection("items").updateOne(
    { _id: new ObjectId(id) },
    { $set: { returned: true, returnedTo } }
  );
  res.json(result);
});

app.delete("/items/:id", async (req, res) => {
  const db = client.db(dbName);
  const id = req.params.id;
  const result = await db.collection("items").deleteOne({ _id: new ObjectId(id) });
  res.json(result);
});

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});

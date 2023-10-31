const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB connection URI
const uri = "mongodb+srv://imagegallery:gYMzyZ3KjPYALzCy@cluster0.jgjsyco.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {

    client.connect();

    console.log("Connected to the MongoDB database");

    const imageCollection = client.db("imageGallery").collection("images");

    app.get("/", (req, res) => {
      res.send("Image gallery server is running");
    });

    app.get("/allimages", async (req, res) => {
      const query = {};
      const cursor = imageCollection.find(query);
      const images = await cursor.toArray();
      res.send(images);
    });

    app.post("/image", async (req, res) => {
      const service = req.body;
      const result = await imageCollection.insertOne(service);
      res.send(result);
    });

    app.delete('/image/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await imageCollection.deleteOne(query);
      res.send(result);
    });

    app.listen(port, () => {
      console.log(`Image gallery server running on ${port}`);
    });
  } catch (error) {
    console.error("Error: ", error);
  } finally {

    await client.close();
  }
}

run().catch((err) => console.error(err));

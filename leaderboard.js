const MongoClient = require('mongodb').MongoClient;

const secret = $({secret.MongoDBKey});
const uri = "mongodb+srv://kyralnboyle:<potty>@handsfaceerase.lyy9q.mongodb.net/<HandsFaceErase>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("HandsFaceErase").collection("leaderboard");
  // perform actions on the collection object
  client.close();
});

const { MongoClient, ObjectID } = require("mongodb");
const Express = require("express");
const Cors = require("cors");
const BodyParser = require("body-parser");
const { request } = require("express");

const client = new MongoClient(process.env["ATLAS_URI"]);
const server = Express();

server.use(BodyParser.json());
server.use(BodyParser.urlencoded({ extended: true }));
server.use(Cors());

var collection;

server.post("/create", async (request, response) => {});
server.get("/get", async (request, response) => {});
server.get("/getNearLocation", async (request, response) => {});

server.listen("3000", async () => {
    try {
        await client.connect();
        collection = client.db("HandsFaceErase").collection("leaderboard");
        collection.createIndex({ "location": "2dsphere" });
    } catch (e) {
        console.error(e);
    }
});

server.post("/create", async (request, response) => {
    try {
        let result = await collection.insertOne(
            {
                "username": request.body.username,
                "score": request.body.score,
                "location": request.body.location
            }
        );
        response.send({ "_id": result.insertedId });
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});

server.get("/get", async (request, response) => {
    try {
        let result = await collection.find({}).sort({ score: -1 }).limit(3).toArray();
        response.send(result);
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});

server.get("/getNearLocation", async (request, response) => {
    try {
        let result = await collection.find({
            "location": {
                "$near": {
                    "$geometry": {
                        "type": "Point",
                        "coordinates": [
                            parseFloat(request.query.longitude),
                            parseFloat(request.query.latitude)
                        ]
                    },
                    "$maxDistance": 25000
                }
            }
        }).sort({ score: -1 }).limit(3).toArray();
        response.send(result);
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});

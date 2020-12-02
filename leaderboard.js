// Adding Mongodb to the file
const MongoClient = require('mongodb').MongoClient;
const Express = require("express");
const Cors = require("cors");
const BodyParser = require("body-parser");
const { request } = require("express");

//ATLAS_URI is an environment variable on my computer and Node.js is reading from that variable.
const client = new MongoClient(process.env["ATLAS_URI"]);
const server = Express();

// const secret = $({secret.MongoDBKey});
const uri = "mongodb+srv://kyralnboyle:<potty>@handsfaceerase.lyy9q.mongodb.net/<HandsFaceErase>?retryWrites=true&w=majority";
//const client = new MongoClient(uri, { useNewUrlParser: true });
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("HandsFaceErase").collection("leaderboard");
  // perform actions on the collection object
  client.close();
});

//This is requesting all the diffrent fumctions
// const { MongoClient, ObjectID } = require("mongodb");
// const Express = require("express");
// const Cors = require("cors");
// const BodyParser = require("body-parser");
// const { request } = require("express");
//
// //ATLAS_URI is an environment variable on my computer and Node.js is reading from that variable.
// const client = new MongoClient(process.env["ATLAS_URI"]);
// const server = Express();

// server.use(BodyParser.json());
server.use(body-parser/package.json());
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

        //tells the js to look for this database
        collection = client.db("HandsFaceErase").collection("leaderboard");
        collection.createIndex({ "location": "2dsphere" });
    } catch (e) {
        console.error(e);
    }
});


//Tells the programme to request the name, score and location
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


//retreive all data but show it as three elements in decending order.
server.get("/get", async (request, response) => {
    try {
        let result = await collection.find({}).sort({ score: -1 }).limit(3).toArray();
        response.send(result);
    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});


//gets the close location and adds it to a close leader board
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

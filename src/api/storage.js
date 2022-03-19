/*

https://www.section.io/engineering-education/nodejs-mongoosejs-mongodb/

CODE MONGO ATLAS POUR LA CONNEXION

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://mongoPireTest:<password>@recpclustertrial.qmxbn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});


*/

const mongoose = require("mongoose");
console.debug("mongoose");
console.debug(mongoose);

const { MongoClient } = require("mongodb");
console.debug("MongoClient");
console.debug(MongoClient);

const username = "mongoPireTest";
const password = "7Pgg6QWv0ZEVNaCR";
const cluster = "recpclustertrial";
const dbname = "sample_training";
mongoose.connect(
  `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config()
app.use(express.json());
app.use(cors())
const port = process.env.PORT || 5000;
app.get("/", (req,res)=>{
   res.send("Hello Javascript")
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1lmda.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
  try{
    await client.connect()
    const smartCollection = client.db("smartCar").collection("service");

    //get services data from database(mongodb)
    app.get("/service", async (req,res)=>{
        const query = {};
        const cursor = smartCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
    })
    //get data with unique id
    app.get("/service/:id",  async (req,res)=>{
       const id = req.params.id;
       const query = {_id: ObjectId(id)};
       const result = await smartCollection.findOne(query);
       res.send(result);
    })
    //post service
    app.put("/service", async  (req,res)=>{
       const service = req.body;
       const result = await smartCollection.insertOne(service);
       res.send(result);
    })

    //delete service
    app.delete("/service/:id", async (req,res)=>{
     const id =req.params.id;
     const query = {_id: ObjectId(id)};
     const result = await smartCollection.deleteOne(query);
     res.send(result);
    })
  }
  finally{
    //await client.close()
  }
}
run().catch(console.dir)
app.listen(port, ()=>{
    console.log("Server is running", port)
})

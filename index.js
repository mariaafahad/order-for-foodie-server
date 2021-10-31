const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;


app.use(bodyParser.json());
app.use(cors());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fzvfh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     console.log('Hitting the database');
//     client.close();
// });



async function run() {
    try {
        await client.connect();
        const database = client.db('food');
        const foodCollections = database.collection('collections');
        const itemsCollection = database.collection('items');
        const specialCollection = database.collection('special');
        const orderCollection = database.collection('order');



        // POST Service
        app.post('/addService', async (req, res) => {
            const special = req.body;
            console.log('hit the post api new', special);
            res.send('post hitted')
            const result = await foodCollections.insertOne(special);
            console.log(result);

        })

        // Order Confirm
        app.post('/newService', async (req, res) => {
            const newServices = req.body;
            console.log('hit the post api new', newServices);
            res.send('post hitted')
            const result = await orderCollection.insertOne(newServices);
            console.log(result);
        });



        // GET SPECIAL SERVICES
        app.get('/special', async (req, res) => {
            const cursor = specialCollection.find({});
            const special = await cursor.toArray()
            res.send(special)

        });

        // GET ITEMS SERVICES
        app.get('/services', async (req, res) => {
            const cursor = itemsCollection.find({});
            const items = await cursor.toArray()
            res.send(items);
        });

        app.get('/newData', async (req, res) => {
            const cursor = foodCollections.find({})
            const collections = await cursor.toArray()
            res.send(collections)

        })
        //   DELETE API
        // app.delete('/services/:id', async (req, res) => {
        //     const id = req.params._id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await foodCollections.deleteOne(query);
        //     res.json(result);
        // })

        app.delete('/services/:id', (req, res) => {
            foodCollections.deleteOne({ _id: ObjectId(req.params._id) })
                .then((result) => {
                    res.send(result.deletedCount > 0)
                })
        })

        // get specific services
        app.get('/specificOrder', (req, res) => {
            ordersCollection.find({ email: req.query.email })
                .toArray((err, documents) => {
                    res.send(documents)
                })
        })



    }

    finally {
        // await client.close();
    }
}



run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('server running');
});





app.listen(port, () => {
    console.log('server running at port');
})




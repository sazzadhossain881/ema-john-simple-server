const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9u8mm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express();
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send('Hello i am working');
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("emaJohnStore").collection("products");
    const ordersCollection = client.db("emaJohnStore").collection("orders");
    // perform actions on the collection object

    app.post('/addProduct', (req, res) => {
        const product = req.body;
        collection.insertOne(product)
            .then(result => {
                res.send(result.insertedCount)
            })
    })

    app.get('/products', (req, res) => {
        collection.find({})
            .toArray((error, documents) => {
                res.send(documents)
            })
    })

    app.get('/product/:key', (req, res) => {
        collection.find({ key: req.params.key })
            .toArray((error, documents) => {
                res.send(documents[0])
            })
    })

    app.post('/productByKeys', (req, res) => {
        const productKeys = req.body;
        collection.find({ key: { $in: productKeys } })
            .toArray((error, documents) => {
                res.send(documents)
            })
    })

    app.post('/orderProducts', (req, res) => {
        const orders = req.body;
        ordersCollection.insertOne(orders)
            .then(result => {
                res.send(result.insertedCount > 0)
            })

    })




    console.log('database connected');
});


app.listen(process.env.PORT || 5000);
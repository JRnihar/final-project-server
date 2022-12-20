const express = require('express');
const app = express();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const cors = require('cors');

require('dotenv').config()

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dctmt.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const partsCollection = client.db('computerParts').collection('Cparts')
        const reviewCollection = client.db('computerParts').collection('Review')
        const orderCollection = client.db('computerParts').collection('order')
        const usersCollection = client.db('computerParts').collection('users')
        const profileCollection = client.db('computerParts').collection('profile')
        //get
        app.get('/part', async (req, res) => {
            const query = {};
            const cursor = partsCollection.find(query)
            const user = await cursor.toArray()
            res.send(user)
        })
        //delete
        app.delete('/part/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await partsCollection.deleteOne(query)
            res.send(result)
        })
        app.post('/part', async (req, res) => {
            const newProduct = req.body
            
            const result = await partsCollection.insertOne(newProduct)
            res.send(result)
        })
        app.get('/review', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query)
            const user = await cursor.toArray()
            res.send(user)
        })
        
        app.post('/review', async (req, res) => {
            const newProduct = req.body
         
            const result = await reviewCollection .insertOne(newProduct)
            res.send(result)
        })

       
    
        app.put('/part/:id', async (req, res) => {
            const id = req.params.id;
            const updatUser = req.body;
           
            const filter = { _id: ObjectId(id) }
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                    orderquantity: updatUser.orderquantity,
                

                }
            };
            const result = await partsCollection.updateOne(filter, updateDoc, option)
            res.send(result);
        });
      
//add item
       
        app.get('/addItem', async (req, res) => {
            const query = {}
            const cursor = orderCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        });

  
        app.post('/addItem', async (req, res) => {
            const newService = req.body;
            const result = await orderCollection.insertOne(newService);
            res.send(result);
        });

 
        app.get("/myorder/:email", async (req, res) => {
            const email = req.params;
            const cursor = orderCollection.find(email)
            const products = await cursor.toArray()
            res.send(products)
        });



        app.delete('/myorder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query)
            res.send(result)
        })

        app.get('/user',  async (req, res) => {
            const users = await usersCollection.find().toArray();
            res.send(users);
        });
        app.get('/admin/:email', async (req, res) => {
            const email = req.params.email;
            const user = await usersCollection.findOne({ email: email });
            const isAdmin = user.role === 'admin';
            res.send({ admin: isAdmin })
        })
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            
            res.send({ result });
        });
        app.put('/user/admin/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const updateDoc = {
                $set: { role: 'admin' },
            };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.send(result);
        })
        
        app.post('/myprofile', async (req, res) => {
            const newService = req.body;
            const result = await profileCollection.insertOne(newService);
            res.send(result);
        });

       

        app.get("/myprofile/:email", async (req, res) => {
            const email = req.params;
            const cursor = profileCollection.find(email)
            const products = await cursor.toArray()
            res.send(products)
        });

        app.put('/myprofile/:id', async (req, res) => {
            const id = req.params.id;
            const updatUser = req.body;
            const filter = { _id: ObjectId(id) }
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                    education: updatUser.education,
                    city: updatUser.city,
                    phone: updatUser.phone

                }
            };
            const result = await profileCollection.updateOne(filter, updateDoc, option)
            res.send(result);
        });
        
    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running my  server')
})

app.listen(port, () => {
    console.log(' server is running ');
})
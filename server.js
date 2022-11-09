const express = require("express");
const app = express();
const req = require("express/lib/request");
const bodyParse= require("body-parser");
const { async } = require("rxjs");
const { query } = require("express");
const crypto = require("crypto");
const ObjectId = require("mongodb").ObjectId;

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.Et9HFtf9R3GEMA0IICOfFMVXY7kkTX1wr4qCyhIf58U'

const path = require("path");
const { header } = require("express/lib/request");
const { ObjectID } = require("bson");

function getClient(){
  const MongoClient = require("mongodb").MongoClient;
  const uri = "mongodb://localhost:27017";                //Connecting Angular to MongoDB.
  return new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
}

app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({extended:true}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    next();
});

app.post("/login", bodyParse.json(), function (req, res) {
  const loginUser = {
    name: req.body.name,
    password: crypto.createHash("md5").update(req.body.password).digest()
  }

  const client = getClient();                 //Search for the entered user, if we found send token back.
    client.connect(async (err) => {
      const collection = client.db("szakdolgozat").collection("users");
      const user = await collection.findOne({$and: [{name: loginUser.name}, {password: loginUser.password}]});

      if(user === null){
        res.send(null);
      }else{
        const token = jwt.sign({ id: user._id, name: user.name, role: user.role}, JWT_SECRET);
        res.send({token: token});
      }
      client.close();
    });
});

function authenticateToken(req, res, next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token === null){
    return res.sendStatus(401)
  }

  jwt.verify(token, JWT_SECRET, (err) => {
    if(err){
      return res.sendStatus(403);
    }
    next();
  })
}


app.post("/register", bodyParse.json(), function(req, res) {
  const newUser = {
    name: req.body.name,
    password: crypto.createHash("md5").update(req.body.password).digest(),
    email: req.body.email,
    role: "admin"
  };

  var alreadyExist = false;

  const client = getClient();
  client.connect(async (err) => {
    const collection = client.db("szakdolgozat").collection("users");
    const user = await collection.findOne({$or: [{name: newUser.name}, {email: newUser.email}]});
    if(user){
      alreadyExist = true;
      res.send(alreadyExist);
      return;
    }
    const result = await collection.insertOne(newUser);
    res.send(alreadyExist);
    client.close();
  });
});

app.get("/clothes", authenticateToken, function (req, res) {
  const client = getClient();

  client.connect(async (err) => {
    const collection = client.db("szakdolgozat").collection("clothes");
    const clothes = await collection.find().toArray();
    res.send(clothes);
    client.close();               //The upper one will write out the clothes if the search input is empty.
  });                             //If the search input isnt empty then the bottom one will write out the filtered ones.
});

app.get("/clothes/:search", authenticateToken, function (req, res) {
  const s = req.params.search;
  var search2 = {"name": new RegExp(s,'i')};
  const client = getClient();
  

  client.connect(async (err) => {
    const collection = client.db("szakdolgozat").collection("clothes");
    const clothes = await collection.find(search2).toArray();
    res.send(clothes);
    client.close();
  });
  
});

function getID(raw){
  try{
    return new ObjectId(raw);
  }catch(err){
    return "Error";
  }
};

app.delete("/delete/:id", authenticateToken, function(req, res){
  const id = new getID(req.params.id);
  if(!id){
    res.send({error: "invalide id"});
    return;
  }
  const client = getClient();
  client.connect(async (err) => {
    const collection = client.db("szakdolgozat").collection("clothes");
    const result = await collection.deleteOne({_id: id});
    if(!result.deletedCount){
      res.send({error: "not found"});
      return;
    }
    res.send({id: req.params.id});
    client.close;
  });
});

app.get("/allcloth", authenticateToken, function (req, res) {
  const client = getClient();


  client.connect(async (err) => {
    const collection = client.db("szakdolgozat").collection("clothes");
    const clothes = await collection.find().toArray();
    res.send(clothes);
    client.close();
  });
});

app.post('/create', authenticateToken, bodyParse.json(), function(req, res){
  const newClothes={
      name: req.body.name,
      price: Number(req.body.price),
      gender: req.body.gender,
      color: req.body.color,
      type: req.body.type,
      size: req.body.size,
      img: req.body.img
  };

  const client = getClient();
  client.connect(async (err) => {
    const collection = client.db("szakdolgozat").collection("clothes");
    const result = await collection.insertOne(newClothes);
    res.send(newClothes);
    client.close();
  });
});

app.put("/update", authenticateToken, bodyParse.json(), function(req, res){
  const id = new getID(req.body._id);
  if(!id){
    res.send({error: "invalide id"});
    return;
  }

  const updateClothes={
    name: req.body.name,
    price: Number(req.body.price),
    gender: req.body.gender,
    color: req.body.color,
    type: req.body.type,
    size: req.body.size,
    img: req.body.img
};

  const client = getClient();
  client.connect(async (err) => {
    const collection = client.db("szakdolgozat").collection("clothes");
    var myquery = {_id: id};
    var newvalues = 
    {$set: {
      name: updateClothes.name, 
      price: Number(updateClothes.price), 
      gender: updateClothes.gender,
      color: updateClothes.color,
      type: updateClothes.type,
      size: updateClothes.size,
      img: updateClothes.img}
    }
    const result = await collection.updateOne(myquery, newvalues, function(err, res){
      if(err){
        throw err;
      }
    });
    res.send(result);
    client.close;
  });
});

app.post('/addcart', authenticateToken, bodyParse.json(), function(req, res){
  const newCart={
      uid: req.body.uid,
      cid: req.body.cid,
      name: req.body.name,
      price: Number(req.body.price),
      gender: req.body.gender,
      color: req.body.color,
      type: req.body.type,
      size: req.body.size,
      img: req.body.img,
      status: req.body.status
  };

  const client = getClient();
  client.connect(async (err) => {
    const collection = client.db("szakdolgozat").collection("cart");
    const result = await collection.insertOne(newCart);
    res.send(newCart);
    client.close();
  });
});

app.get("/getcart/:id", authenticateToken, function (req, res) {
  const id = req.params.id;
  const client = getClient();

  client.connect(async (err) => {
    const collection = client.db("szakdolgozat").collection("cart");
    const cart = await collection.find({uid: id, status: 1}).toArray();
    res.send(cart);
    client.close();
  });
  
});

app.delete("/deletecart/:id", authenticateToken, function(req, res){
  const id = new getID(req.params.id);
  if(!id){
    res.send({error: "invalide id"});
    return;
  }
  const client = getClient();
  client.connect(async (err) => {
    const collection = client.db("szakdolgozat").collection("cart");
    const result = await collection.deleteOne({_id: id});
    if(!result.deletedCount){
      res.send({error: "not found"});
      return;
    }
    res.send(result);
    client.close;
  });
});

app.post("/filter", authenticateToken, bodyParse.json(), function (req, res) {
  const newFilter = {
    search: req.body.search,
    price1: req.body.price1,
    price2: req.body.price2,
    price3: req.body.price3,
    price4: req.body.price4,
    price5: req.body.price5,
    price6: req.body.price6,
    female: req.body.female,
    male: req.body.male,
    shirt: req.body.shirt,
    tshirt: req.body.tshirt,
    coat: req.body.coat,
    trousers: req.body.trousers,
    skirt: req.body.skirt,
    sizexs: req.body.sizexs,
    sizes: req.body.sizes,
    sizem: req.body.sizem,
    sizel: req.body.sizel,
    sizexl: req.body.sizexl,
  };

  var price1min = 0;
  var price1max = 0;
  var price2min = 0;
  var price2max = 0;
  var price3min = 0;
  var price3max = 0;
  var price4min = 0;
  var price4max = 0;
  var price5min = 0;
  var price5max = 0;
  var price6min = 0;
  var price6max = 0;
  
  var gender = new Array();
  var type = new Array();
  var size = new Array();

  if(!newFilter.price1 && !newFilter.price2 && !newFilter.price3 && !newFilter.price4 && !newFilter.price5 && !newFilter.price6){
    price1max = 1000000;
  }

  if(newFilter.price1){
    price1min = 0;
    price1max = 2001;
  }
  if(newFilter.price2){
    price2min = 1999;
    price2max = 4001;
  }
  if(newFilter.price3){
    price3min = 3999;
    price3max = 8001;
  }
  if(newFilter.price4){
    price4min = 7999;
    price4max = 10001;
  }
  if(newFilter.price5){
    price5min = 9999;
    price5max = 15001;
  }
  if(newFilter.price6){
    price6min = 14999;
    price6max = 20001;
  }

  if(!newFilter.male && !newFilter.female){
    gender.push("male");
    gender.push("female");
  }
  if(newFilter.male){
    gender.push("male");
  }
  if(newFilter.female){
    gender.push("female");
  }

  if(!newFilter.shirt && !newFilter.tshirt && !newFilter.coat && !newFilter.trousers && !newFilter.skirt){
    type.push("shirt");
    type.push("t-shirt");
    type.push("coat");
    type.push("trousers");
    type.push("skirt");
  }
  if(newFilter.shirt){
    type.push("shirt");
  }
  if(newFilter.tshirt){
    type.push("t-shirt");
  }
  if(newFilter.coat){
    type.push("coat");
  }
  if(newFilter.trousers){
    type.push("trousers");
  }
  if(newFilter.skirt){
    type.push("skirt");
  }

  if(!newFilter.sizexs && !newFilter.sizes && !newFilter.sizem && !newFilter.sizel && !newFilter.sizexl){
    size.push("XS");
    size.push("S");
    size.push("M");
    size.push("L");
    size.push("XL");
  }
  if(newFilter.sizexs){
    size.push("XS");
  }
  if(newFilter.sizes){
    size.push("S");
  }
  if(newFilter.sizem){
    size.push("M");
  }
  if(newFilter.sizel){
    size.push("L");
  }
  if(newFilter.sizexl){
    size.push("XL");
  }
  
  const client = getClient();
  client.connect(async (err) => {
    const collection = client.db("szakdolgozat").collection("clothes");
    const clothes = await collection.find({
      "name": new RegExp(newFilter.search,'i'),
      $or: [
        {"price": {"$gt": price1min, "$lt": price1max}},
        {"price": {"$gt": price2min, "$lt": price2max}},
        {"price": {"$gt": price3min, "$lt": price3max}},
        {"price": {"$gt": price4min, "$lt": price4max}},
        {"price": {"$gt": price5min, "$lt": price5max}},
        {"price": {"$gt": price6min, "$lt": price6max}}
      ],
      "gender": { $in: gender },
      "type": { $in: type },
      "size": { $in: size }
    }).toArray();
    res.send(clothes);
    client.close();
  });
  
});

app.post("/bought", authenticateToken, bodyParse.json(), function(req, res){
  const id = req.body[0].uid;


  const client = getClient();
  client.connect(async (err) => {
    const collection = client.db("szakdolgozat").collection("cart");
    var userid = {uid: id};
    var newvalues = {$set: {status: 2}}
    succes = true;
    const result = await collection.updateMany(userid, newvalues, function(err, res){
      if(err){
        throw err;
      }
    });
    res.send(succes);
    client.close;
  });
});

app.get("/users", function (req, res) {
  const client = getClient();

  client.connect(async (err) => {
    const collection = client.db("szakdolgozat").collection("users");
    const users = await collection.find().toArray();
    res.send(users);
    client.close();
  });
});

app.put("/updaterole", authenticateToken, bodyParse.json(), function(req, res){
  const id = new getID(req.body._id);
  const role = req.body.role;
  if(!id){
    res.send({error: "invalide id"});
    return;
  }

  const client = getClient();
  client.connect(async (err) => {
    const collection = client.db("szakdolgozat").collection("users");
    var userid = {_id: id};
    var newvalues = {$set: {role: role}}
    const result = await collection.updateOne(userid, newvalues, function(err, res){
      if(err){
        throw err;
      }
    });
    res.send(result);
    client.close;
  });
});


app.listen(4000);
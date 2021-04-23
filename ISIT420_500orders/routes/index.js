var express = require('express');
var router = express.Router();

// mongoose is a API wrapper overtop of mongodb, just like
// .ADO.Net is a wrapper over raw SQL server interface
const mongoose = require("mongoose");

const FiftyOrdersTest = require("../500orders");


// edited to include my non-admin, user level account and PW on mongo atlas
// and also to include the name of the mongo DB that the collection is in (TaskDB)
const dbURI =
  "mongodb+srv://isit420user:Th3L0veBug@cluster0-skb5s.azure.mongodb.net/ToDosDB?retryWrites=true&w=majority";

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10
};

mongoose.connect(dbURI, options).then(
  () => {
    console.log("Database connection established!");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);


/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile('index.html');
 
});

/* send to Mongo. */
router.post('/NewOrder', function(req, res) {
  const purchRecord = req.body;
  console.log (purchRecord)
});

/* post a new purchase record and push to Mongo */
router.post('/FiveHundredRecords', function(req, res) {

  let aNewOrder = new FiftyOrdersTest(req.body);  
  

  aNewOrder.save((err, newOrder) => {
    if (err) {
      res.status(500).send(err);
    }
    else {
    console.log(newOrder);
    res.status(201).json(newOrder);
    }
  }); 
});


// retrieve records
router.get('/GetRecords', function(req, res) {
  // find {  takes values, but leaving it blank gets all}
  FiftyOrdersTest.find({}, (err, AllRecords) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).json(AllRecords);
  });
});

module.exports = router;

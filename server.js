const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const mockgoose = require('mockgoose');
const port = 8080;
const customer = require('./app/routes/customer');

//db connection      
mockgoose(mongoose).then(() => {
  mongoose.connect('mongodb://example.com/TestingDB', err => {});
});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//parse application/json and look for raw text                                        
app.use(bodyparser.json());                                     
app.use(bodyparser.urlencoded({extended: true}));               
app.use(bodyparser.text());                                    
app.use(bodyparser.json({ type: 'application/json'}));  

app.get("/", (req, res) => res.json({message: "Welcome!"}));

app.route("/customer")
  .get(customer.getCustomers)
  .post(customer.postCustomer);
app.route("/customer/:id")
  .get(customer.getCustomer)
  .delete(customer.deleteCustomer)
  .put(customer.updateCustomer);

app.listen(port);
console.log("Listening on port " + port);

module.exports = app; // for testing

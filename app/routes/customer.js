import mongoose from 'mongoose';
mongoose.promise = global.Promise;
//import {Customer, CustomerAddress} from '../models/customer';
const Customer = require('../models/customer');
const CustomerAddress = require('../models/customeraddress');

function getCustomers(req, res) {
  const query = CustomerAddress
    .where('street_address').ne(null).populate('customer').exec()
    .then(customers => res.json(customers)); 
}

function postCustomer(req, res) {
  let {name, address} = req.body;
  Customer.findOne({}).sort('-_id').exec()
    .then(last => {
        const customer = new Customer({_id: ++last._id, name});
        return customer.save();
      })
    .then(customer => {
      return CustomerAddress.findOne({}).sort('-_id').exec()
        .then(last => {
          address = new CustomerAddress(
              Object.assign(address, {
                _id: ++last._id, customer: customer._id})); 
          return address.save();
        });
      })
    .then(address => address.populate('customer').execPopulate())
    .then(customer => {
      return res.json({message: "Customer successfully added!", customer});
    })
    .catch(e => {
      console.log(e);
      res.send(e);
    });
}

function getCustomer(req, res) {
  Customer.findById(req.params.id).exec()
    .then(customer => CustomerAddress.findOne({customer: customer._id})
        .populate('customer').exec())
    .then(address => res.json(address))
    .catch(e => {
      console.log(e);
      res.send(e);
    });
}

function deleteCustomer(req, res) {
  Customer.findById(req.params.id).exec()
    .then(customer => {
      return Promise.all([
        CustomerAddress.remove({customer: customer._id}),
        Customer.remove({_id: customer._id})]);
    })
    .then(result => res.json(
          {message: 'Customer successfully deleted!', result}))
    .catch(e => {
      console.log(e);
      res.send(e);
    });
}

function updateCustomer(req, res) {
  const {name, address} = req.body;
  Customer.findById(req.params.id).exec()
      .then(customer => Object.assign(customer, {name}).save())
      .then(customer => 
          CustomerAddress.findOne({customer: customer._id}).exec())
      .then(addressToUpdate => Object.assign(addressToUpdate, address).save())
      .then(address => address.populate('customer').execPopulate())
      .then(customer => res.json({ message: 'Customer updated!', customer }))
    .catch(e => {
      console.log(e);
      res.send(e);
    });
}

//export all the functions
export { getCustomer, getCustomers,
  updateCustomer, postCustomer, deleteCustomer };

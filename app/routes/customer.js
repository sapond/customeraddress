import mongoose from 'mongoose';
mongoose.promise = global.Promise;
const Customer = require('../models/customer');
const CustomerAddress = require('../models/customeraddress');


/**
 * getCustomers - description
 * @param  {type} req description
 * @param  {type} res description
 */
function getCustomers(req, res) {
  CustomerAddress
    .where('street_address').ne(null).populate('customer').exec()
    .then((customers) => res.json(customers));
}

/**
 * postCustomer - description
 *
 * @param  {type} req description
 * @param  {type} res description
 */
function postCustomer(req, res) {
  let {name, address} = req.body;
  Customer.findOne({}).sort('-_id').exec()
    .then((last) => {
        const customer = new Customer({_id: ++last._id, name});
        return customer.save();
      })
    .then((customer) => {
      return CustomerAddress.findOne({}).sort('-_id').exec()
        .then((last) => {
          address = new CustomerAddress(
              Object.assign(address, {
                _id: ++last._id, customer: customer._id}));
          return address.save();
        });
      })
    .then((address) => address.populate('customer').execPopulate())
    .then((customer) => {
      return res.json({message: 'Customer successfully added!', customer});
    })
    .catch((e) => {
      console.log(e);
      res.send(e);
    });
}

/**
 * getCustomer - description
 * @param  {type} req description
 * @param  {type} res description
 */
function getCustomer(req, res) {
  Customer.findById(req.params.id).exec()
    .then((customer) => CustomerAddress.findOne({customer: customer._id})
        .populate('customer').exec())
    .then((address) => res.json(address))
    .catch((e) => {
      console.log(e);
      res.send(e);
    });
}

/**
 * deleteCustomer - description
 * @param  {type} req description
 * @param  {type} res description
 */
function deleteCustomer(req, res) {
  Customer.findById(req.params.id).exec()
    .then((customer) => {
      return Promise.all([
        CustomerAddress.remove({customer: customer._id}),
        Customer.remove({_id: customer._id})]);
    })
    .then((result) => res.json(
          {message: 'Customer successfully deleted!', result}))
    .catch((e) => {
      console.log(e);
      res.send(e);
    });
}

/**
 * updateCustomer - description
 * @param  {type} req description
 * @param  {type} res description
 */
function updateCustomer(req, res) {
  const {name, address} = req.body;
  Customer.findById(req.params.id).exec()
      .then((customer) => Object.assign(customer, {name}).save())
      .then((customer) =>
          CustomerAddress.findOne({customer: customer._id}).exec())
      .then((addressToUpdate) => Object.assign(addressToUpdate, address).save())
      .then((address) => address.populate('customer').execPopulate())
      .then((customer) => res.json({message: 'Customer updated!', customer}))
    .catch((e) => {
      console.log(e);
      res.send(e);
    });
}

export {getCustomer, getCustomers, updateCustomer,
  postCustomer, deleteCustomer};

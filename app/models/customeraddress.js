import mongoose from 'mongoose';
const {Schema} = mongoose;

const CustomerAddressSchema = new Schema(
  {
    _id: Number,
    customer: {type: Number, ref: 'Customer'},
    street_address: {type: String},
    postal_code: {type: Number},
    country: {type: String},
  }
);

//Exports the BookSchema for use elsewhere.
module.exports = mongoose.model('CustomerAddress', CustomerAddressSchema);

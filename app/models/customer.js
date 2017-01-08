import mongoose from 'mongoose';
const {Schema} = mongoose;

//book schema definition
const CustomerSchema = new Schema(
  {
    _id: Number,
    name: {type: String, required: true }
  }
);

//Exports the BookSchema for use elsewhere.
module.exports = mongoose.model('Customer', CustomerSchema);

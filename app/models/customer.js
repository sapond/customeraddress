
import mongoose from 'mongoose';
const {Schema} = mongoose;

const CustomerSchema = new Schema(
  {
    _id: Number,
    name: {type: String, required: true},
  }
);

module.exports = mongoose.model('Customer', CustomerSchema);

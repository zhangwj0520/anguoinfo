const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const MedUsersSchema = new Schema({
  userName: {
    type: String,
    rquired: true,
  },
  passWord: {
    type: String,
    rquired: true,
  },
  name: {
    type: String,
  },
  mobile: {
    type: String,
  }, 
  currentAuthority:{
    type:Array,
    default:[]
  },
  create_at: {
    type: Date,
    default: Date.now,
  },
  key:{
    type: Number,
  }
});
module.exports = mongoose.model('med_users', MedUsersSchema);

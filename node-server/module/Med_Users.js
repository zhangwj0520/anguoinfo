const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const MedUsersSchema = new Schema({
  userName: {
    type: String,
    rquired: true
  },
  passWord: {
    type: String,
    rquired: true
  },
  name: {
    type: String,
    default: "新用户"
  },
  currentAuthority: {
    type: Array,
    default: ["0"]
  },
  lastLoginTime: {
    type: String
  },
  regTime: {
    type: String
  },
  ok: {
    type: String,
    default: "no"
  }
});
module.exports = mongoose.model("med_users", MedUsersSchema);

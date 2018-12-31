const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const ProfileSchema = new Schema({
  sn: {
    type: String,
    rquired: true
  },
  dingdan_time: {
    type: String,
    rquired: true
  },
  time: {
    type: Number,
    rquired: true
  },
  fahuo_time: {
    type: String,
    rquired: true
  },
  vender: {
    type: String,
    rquired: true
  },
  venderType: {
    type: String,
    rquired: true
  },
  data: {
    type: Array,
    rquired: true
  },
  key: {
    type: String,
    rquired: true
  },
  status: {
    type: Number,
    default: 0
  },
  dingdan_totalPrice: {
    type: Number
    //rquired: true,
  },
  caigou_totalPrice: {
    type: Number
    //rquired: true,
  },
  zhongbiao_totalPrice: {
    type: Number,
    default: 0
  },
  //结算总金额
  jiesuan_price: {
    type: Number,
    default: 0
  },
  //运费
  spend: {
    type: Number,
    default: 0
  },
  spendList: {
    type: Array,
    default: []
  },
  dataSourse: {
    type: Array
  },
  cols: {
    type: Array
  },
  baojiao_index: {
    type: String
  }
});
module.exports = Profile = mongoose.model("Med_List", ProfileSchema);

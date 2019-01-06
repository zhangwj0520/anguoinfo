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
  fahuo_time: {
    type: String,
    rquired: true
  },
  vender: {
    type: String,
    rquired: true
  },
  data: {
    type: Object,
    rquired: true
  },
  key: {
    type: String,
    rquired: true
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
  },
  fileName: {
    type: String
  }
});
module.exports = Profile = mongoose.model("Med_List", ProfileSchema);

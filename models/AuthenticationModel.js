const mongoose = require("mongoose");
const schema = mongoose.schema;

const authentication = new mongoose.Schema({
  FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Contact: {
    type: String,
    required: true,
  }, 
  Role: {
    type: String,
    required: true,
  },
  Branch:{
    type:String,
    required: false
},
  PasswordHash: {
    type: String,
    required: true,
  },
},{ timestamps: true });

const Authentication = mongoose.model("Authentication", authentication);
module.exports = Authentication;
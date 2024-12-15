const mongoose=require('mongoose');
const schema=mongoose.schema;

const UserManagementSchema = new mongoose.Schema({

FirstName:{
    type:String,
    required: true
},
LastName:{
    type:String,
    required: true
},

Email:{
    type:String,
    required: true
},
Contact:{
    type:Number,
    required: true
},
Role:{
    type:String,
    required: true
},
Branch:{
    type:String,
    required: false
},
PasswordHash:{
    type:String,
    required: true
    },
Profile:{
    type:String,
     required: false
},
LastLoginDate:{
    type:String,
     required: false
},
LastLoginTime:{
    type:String,
     required: false
}
},{ timestamps: true });

const UserManagement = mongoose.model("User Management",UserManagementSchema);
module.exports=UserManagement;
const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    firstName:{
        type: String,
        required: true,
        minLength:3,
        maxLength:20
    },
    lastName:{
        type:String,
        minLength:3,
        maxLength:20,
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim: true,
        lowercase:true,
        immutable: true,
    },
    age:{
        type:Number,
        min:6,
        max:80,
    },
    role:{
        type:String,
        enum:['user','admin'],
        default: 'user'
    },
 // User model — update problemSolved field
problemSolved: {
  type: [{
    type: Schema.Types.ObjectId,
    ref: 'problem'    // keep lowercase to match your mongoose.model()
  }],
  default: []         // ← ADD THIS, remove unique:true from array field
},
    password:{
        type:String,
        required: true
    }
},{
    timestamps:true
});


const User = mongoose.model("user",userSchema);

module.exports = User;

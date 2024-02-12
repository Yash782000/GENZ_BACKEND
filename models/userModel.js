const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const {objectId} = mongoose.Schema;


const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please add a name"]
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
       // validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password:{
        type:String,
        required:[true,"Please add a password"],
        minLength:[6,"Password must be up to 6 characters"]
    },
    role:{
        type:String,
        required:true,
        default:"customer",
        enum:["customer","admin"]
    },
    photo:{
        type:String,
        required:[true,"please add a photo"],
        default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fuser-profile&psig=AOvVaw2uzrA3Ie3AP-5K66ax3aPz&ust=1707326215367000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCPD6n_ibl4QDFQAAAAAdAAAAABAE"
    },
    phone:{
        type:String,
        default:"+91"
    },
    address:{
        type:Object,
        //address,state,country
    }
})
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next()
    }
    else{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword =await  bcrypt.hash(this.password,salt);
        this.password = hashedPassword;
        next();
    }
})


const User = mongoose.model("User",userSchema);

module.exports = User;
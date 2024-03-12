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
        default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fvectors%2Fblank-profile-picture-mystery-man-973460%2F&psig=AOvVaw0w9nFQ-APv5h6qOC6YYhWE&ust=1707877989630000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCNjXlrmjp4QDFQAAAAAdAAAAABAE"
    },
    phone:{
        type:String,
        default:"+91"
    },
    address:{
        type:Object,
        //address,state,country
    },
    cartItems:{
        type:[Object],
        
    }
},{
    timestamps:true
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
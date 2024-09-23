import mongoose, {Document, Schema} from "mongoose";

// extends -> inheritance
// Message inherits all the properties of Document which we have imported from the mongoose
export interface Message extends Document{
    // ts string is written in lowercase
    content : string;
    createdAt: Date
}

// syntax similar to cpp stl like vector<int> 
const MessageSchema : Schema<Message> = new Schema({
    content : {
        // mongoose string is written in first letter uppercase
        // linting ensures that type is given correct
        // type : Number, error by lint
        type : String,
        required : true
    },
    createdAt :{
        type : Date,
        required : true,
        default : Date.now
    }
})

export interface User extends Document{
    // ts string is written in lowercase
    username : string;
    email : string;
    password : string;
    verifyCode : string;
    verifyCodeExpiry : Date;
    isVerified : boolean;
    isAcceptingMessage : boolean;
    messages : Message[];
}

const UserSchema : Schema<User> = new Schema({
    username: {
        type : String,
        required : [true, "Username is required"],
        trim : true,
        unique : true
    },
    email : {
        type : String,
        required : [true, "Email is required"],
        unique : true,
        match : [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please use a valid Email address"]
    },
    password : {
        type : String,
        required : [true, "Password is required"],
    }, 
    verifyCode : {
        type : String,
        required : [true, "verify Code is required"],
    },
    verifyCodeExpiry : {
        type : Date,
        required : [true, "Verify Code expiry is required field"],
    },
    isVerified : {
        type : Boolean,
        default : false,
    },
    isAcceptingMessage : {
        type : Boolean,
        default : true,
    },
    messages : [MessageSchema]
})

// why using "or" -> Next js is not sure about whether app is running for the first time or not, so we check whether exisiting model is present or not, if not we make new model and export it.
// why using as mongoose.Model(User) -> It is a concept of typeScript, here we are telling that we are exporting data of type User Model
const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;
import connectDB from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request : Request){
    await connectDB();

    try {
       const {username, email, password} = await request.json();
       // good naming convention
       const existingUserVerifiedByUsername = await UserModel.findOne({
        username,
        isVerified : true
       })
       if(existingUserVerifiedByUsername){
        return Response.json({
            success : false,
            message : "Username is already taken"
        }, {status : 400})
       }

       const existingUserByEmail = await UserModel.findOne({email});
       const verifyCode = Math.floor(10000 + Math.random()*900000).toString();
       console.log(verifyCode);

       if(existingUserByEmail){
            if(existingUserByEmail.isVerified)
            {
                return Response.json({
                    success : false,
                    message : "User already exists with this email"
                }, {status : 400})
            }else{
                const hashedPass = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPass;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
       }else{
            const hashedPass = await bcrypt.hash(password, 10);
            // objects are stored by reference in memory so whether we write let or const before it we can update it
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password : hashedPass,
                verifyCode,
                verifyCodeExpiry : expiryDate,
                isVerified : false,
                isAcceptingMessage : true,
                messages : []
            })
            await newUser.save();
       }

       // send verification Email
       const emailResponse = await sendVerificationEmail(email, username, verifyCode)

       if(!emailResponse.success){
        return Response.json({
            success : false,
            message : emailResponse.message
        }, {status : 500})
       }
       return Response.json({
        success : true,
        message : "User registered successfully. Please verify your email"
    }, {status : 201})

    } catch (error) {
        console.error("Error registering user", error);
        return Response.json(
            {
                success: false,
                message : "Error registering user"
            },
            {
                status : 500
            }
        )
        
    }
}
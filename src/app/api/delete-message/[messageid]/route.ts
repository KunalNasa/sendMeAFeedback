import connectDB from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel, { User } from "@/models/User.model";
import { ObjectId } from "mongodb"; 

export async function DELETE(request:Request, {params} : {params : {messageid : string}}) {
    await connectDB();
    const messageId = params.messageid
    const session = await getServerSession(authOptions);
    const user : User = session?.user as User;
    if(!session || !session.user){
        return Response.json({
            success : false,
            message : "User not Authenticated"
        }, {status : 403})
    }
    try {
        const objectIdMessageId = new ObjectId(messageId);
        const updatedResult = await UserModel.updateOne(
            {_id : user._id},
            {$pull : {messages : {_id : objectIdMessageId}}}
        )
        // console.log(updatedResult);
        // console.log(updatedResult.modifiedCount);
        if(updatedResult.modifiedCount === 0){
            return Response.json({
                success : false,
                message : "Message not found or already deleted"
            }, {status : 400})
        }

        return Response.json({
            success : true,
            message : "Message deleted successfully"
        }, {status : 200})
    } catch (error) {
        console.error("Internal server error", error);
        return Response.json({
            success : false,
            message : "Error in delete message route"
        }, {status : 500}
    )
    }
}
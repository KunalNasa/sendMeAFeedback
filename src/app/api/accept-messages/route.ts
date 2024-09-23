import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import { User } from 'next-auth';
import connectDB from '@/lib/dbConnect';
import UserModel from '@/models/User.model';



export async function POST(request : Request) {
    await connectDB();

    const session = await getServerSession(authOptions);
    const user : User = session?.user as User;
    if(!session || !session.user)
    {
        return Response.json({
            success : false,
            message : "Not authenticated",
        }, {status : 401})
    }
    const userId = user._id;
    const {acceptMessages} = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {isAcceptingMessage : acceptMessages}, {new : true});
        if(!updatedUser)
        {
            return Response.json({
                success : false,
                message : "Unable to find user to update message acceptance status"
            }, {status : 404})
        }
        return  Response.json({
            success : true,
            message : "Message acceptance status updated successfully",
            updatedUser
        }, {status : 200})
    } catch (error) {
        console.error('Error updating message acceptance status:', error);
        return Response.json(
        { success: false, message: 'Error updating message acceptance status' },
        { status: 500 }
    );
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request : Request) {
    await connectDB();
    const session = await getServerSession(authOptions);
    const user : User = session?.user as User;
    if(!session || !session.user)
    {
        return Response.json({
            success : false,
            message : "Not authenticated",
        }, {status : 401})
    }
    try {
        const foundUser = await UserModel.findById(user._id);
        if(!foundUser)
        {
            return Response.json({
                success : false,
                message : "User not found"
            }, {status : 404});
        }

        return Response.json({
            success : true,
            isAcceptingMessage : foundUser.isAcceptingMessage
        }, {status : 200})
    } catch (error) {
        console.error('Error updating message acceptance status:', error);
        return Response.json(
        { success: false, message: 'Error retrieving message acceptance status'},
        { status: 500 }
    );
    }
}
import connectDB from '@/lib/dbConnect';
import UserModel from '@/models/User.model';
import mongoose from 'mongoose';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';



// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request:Request) {
    await connectDB();

    const session = await getServerSession(authOptions);
    const user : User = session?.user as User;;

    if(!session || !session.user)
    {
        return Response.json({
            success : false,
            message : "Not Authenticated"
        },{status : 401});
    }
    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: { path: '$messages', preserveNullAndEmptyArrays: true } },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } },
          ]).exec();

        // console.log(user[0]);

        if(!user || user.length === 0)
        {
            return Response.json({
                success : false,
                message : "User not found"
            },{status : 401});
        }
        return Response.json({
            success : true,
            messages : user[0].messages
        },{status : 200});

    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}
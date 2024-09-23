import "next-auth"
import { DefaultSession } from "next-auth"


// updating the inbuilt module of next auth according to our requirements
declare module 'next-auth'{
    interface User{
        _id?: string,
        isVerified?: boolean,
        isAcceptingMessages?: boolean,
        username?: string
    }
    interface Session{
        user : {
            _id?: string,
            isVerified?: boolean,
            isAcceptingMessages?: boolean,
            username?: string
        } & DefaultSession['user']
    }
}

// alternate way of writing
declare module 'next-auth/jwt'{
    interface JWT{
            _id?: string,
            isVerified?: boolean,
            isAcceptingMessages?: boolean,
            username?: string
    }
}
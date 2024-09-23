import {z} from "zod"

export const signInSchema = z.object({
    // identifier -> username, email, phone no
    identifier : z.string(),
    password : z.string()
})
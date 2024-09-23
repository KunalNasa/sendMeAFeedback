import {z} from "zod"


// we are directly checking here without making any object because there is only one field
export const usernameValidation = z
    .string()
    .min(2, "Username must be of atleast 2 character")
    .max(20, "Username should not exceed 20 characters length")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters")

export const signUpSchema = z.object({
    username : usernameValidation,
    email : z.string().email({message : "invalid email address"}),
    password : z.string().min(6, {message : "Password must be atleast six character"})
})
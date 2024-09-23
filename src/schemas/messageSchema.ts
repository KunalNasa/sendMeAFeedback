import {z} from "zod"

export const MessagesSchema = z.object({
    content : z
    .string()
    .min(10, {message : "Content must be of atleast 10 characters"})
    .max(300, {message : "Content must be no longer than 300 characters"})
})
import * as z from 'zod';

export const ThreadValidation = z.object({
  thread: z.string().min(3,{message: "Minimum of 3 characters are required"}).max(1000,{message: "Maximum of 1000 characters are allowed"}),
  accountID: z.string().min(1)
})

export const CommentValidation = z.object({
  thread: z.string().min(3,{message: "Minimum of 3 characters are required"}).max(1000,{message: "Maximum of 1000 characters are allowed"}),
})
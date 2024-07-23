import * as z from 'zod';

export const UserValidation = z.object({
  profile_image: z.string().url().min(1),
  name: z.string().min(3,{message: "min 3 chars"}).max(30,{message: "max 30 chars"}),
  username: z.string().min(3,{message: "min 3 chars"}).max(30,{message: "max 30 chars"}),
  bio: z.string().max(1000,{message: "max 1000 chars"}),
})
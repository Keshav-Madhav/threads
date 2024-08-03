"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import * as z from 'zod';
import { Input } from "../ui/input"
import { usePathname, useRouter } from "next/navigation"
import { CommentValidation } from "@/lib/validations/thread"
import Image from "next/image"
import { addComment } from "@/lib/actions/Thread.actions"

type Props = {
  threadId: string
  userImage: string
  userId: string
}

const Comment = ({ threadId, userImage, userId }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  
  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: '',
      accountID: userId
    }
  })

  const onSubmit = async (data: z.infer<typeof CommentValidation>) => {
    await addComment(
      data.thread,
      JSON.parse(userId),
      threadId,
      pathname
    );

    form.reset();
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="comment-form"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3 w-full">
              <FormLabel>
                <Image
                  src={userImage}
                  alt="user"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1 !mt-0">
                <Input
                  className="text-light-1 no-focus outline-none !mt-0"
                  placeholder="Comment... "
                  type="text"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="bg-primary-500 rounded-full whitespace-nowrap">Post Comment</Button>
      </form>
    </Form>
  )
}

export default Comment
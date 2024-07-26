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
import { Textarea } from "../ui/textarea"
import { usePathname, useRouter } from "next/navigation"
import { ThreadValidation } from "@/lib/validations/thread"
import { createThread } from "@/lib/actions/Thread.actions"


type Props = {
  userID: string
}

const PostThread = ({ userID }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  
  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: '',
      accountID: userID
    }
  })

  const onSubmit = async (data: z.infer<typeof ThreadValidation>) => {
    await createThread(
      data.thread,
      data.accountID,
      pathname,
      null
    );

    router.push("/");
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="flex flex-col justify-start gap-10 mt-10"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1 ">
                <Textarea
                  className="account-form_input no-focus"
                  placeholder="Knot Content"
                  {...field}
                  rows={15}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <Button type="submit" className="bg-primary-500">Post Knot</Button>
      </form>
    </Form>
  )
}

export default PostThread
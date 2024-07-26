"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserValidation } from "@/lib/validations/user"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import * as z from 'zod';
import Image from "next/image"
import { Textarea } from "../ui/textarea"
import { useState } from "react"
import { isBase64Image } from "@/lib/utils"
import { useUploadThing } from "@/lib/uploadThing"
import { updateUser } from "@/lib/actions/User.actions"
import { usePathname, useRouter } from "next/navigation"


type Props = {
  user: {
    id: string,
    objectId: string,
    username: string,
    name: string,
    bio: string,
    image: string
  },
  btnTitle: string
}

const AccountProfile = ({user, btnTitle}: Props) => {
  const [files, setFiles] = useState<File[]>([])
  const { startUpload } = useUploadThing("media")  
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_image: user.image || "",
      name: user.name || "",
      username: user.username || "",
      bio: user.bio || ""
    }
  })

  const onSubmit = async (data: z.infer<typeof UserValidation>) => {
    const blob = data.profile_image;

    const hasImageChanged = isBase64Image(blob);

    if(hasImageChanged) {
      const imgRes = await startUpload(files)

      if(imgRes && imgRes[0].url) {
        data.profile_image = imgRes[0].url;
      }
    }

    await updateUser(
      user.id,
      data.username,
      data.name,
      data.bio,
      data.profile_image,
      pathname
    )

    if(pathname === '/profile/edit'){
      router.back()
    } else{
      router.push('/')
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if(e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      setFiles(Array.from(e.target.files))

      if(!file.type.includes("image")) return;

      fileReader.onload = async(e) => {
        const image = e.target?.result?.toString() || ''

        fieldChange(image)
      }

      fileReader.readAsDataURL(file)
    }
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="profile_image"
          render={({ field }) => (
            <FormItem className="flex it gap-4">
              <FormLabel className="account-form_image-label">
                {field.value ? (
                  <Image
                    src={field.value}
                    width={96}
                    height={96}
                    alt="profile image"
                    priority
                    className="rounded-full object-contain"
                  />
                ):(
                  <Image
                    src='/profile.svg'
                    width={24}
                    height={24}
                    alt="profile image"
                    className="object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input 
                  type="file"
                  accept="image/*"
                  placeholder="Upload your profile image"
                  className="account-form_image-input"
                  onChange={(e) => {handleImageChange(e, field.onChange)}}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Name
              </FormLabel>
              <FormControl>
                <Input
                  className="account-form_input no-focus"
                  placeholder="Name"
                  {...field}
                  typeof="text"
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Username
              </FormLabel>
              <FormControl>
                <Input
                  className="account-form_input no-focus"
                  placeholder="Username"
                  {...field}
                  typeof="text"
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  className="account-form_input no-focus"
                  placeholder="Biography"
                  {...field}
                  rows={10}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">Submit</Button>
      </form>
    </Form>
  )
}

export default AccountProfile
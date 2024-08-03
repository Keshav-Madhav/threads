"use client"

import Image from "next/image"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

type Props = {
  id: string
  username: string
  name: string
  image: string
  userType: string
}

const UserCard = ({ id, username, name, image, userType }: Props) => {
  const router = useRouter()
  return (
    <article className="user-card">
      <div className="user-card_avatar">
        <Image
          src={image}
          alt={username}
          width={48}
          height={48}
          className="rounded-full"
        />

        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1">{name}</h4>
          <p className="text-small-medium text-gray-1">@{username}</p>
        </div>
      </div>

      <Button
        className="user-card_btn"
        onClick={()=> router.push(`/profile/${id}`)}
      > View Profile </Button>
    </article>
  )
}

export default UserCard
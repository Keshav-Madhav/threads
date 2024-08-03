import ProfileHeader from "@/components/shared/ProfileHeader"
import { fetchUser } from "@/lib/actions/User.actions"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const page = async ({ params }: { params:{id:string} }) => {
  if (!params) return null
  const user = await currentUser();
  if (!user) return null

  const userInfo = await fetchUser(params.id);
  if(!userInfo?.onBoarded) redirect('/onboarding')

  return (
    <section>
      <ProfileHeader
        accountId={userInfo._id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgURL={userInfo.image}
        bio={userInfo.bio}
      />
    </section>
  )
}

export default page
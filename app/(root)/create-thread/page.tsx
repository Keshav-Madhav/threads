import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/User.actions";
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const page = async () => {
  const user = await currentUser();

  if(!user) return null;

  const userInfo = await fetchUser(user.id);

  if(!userInfo?.onBoarded) redirect("/onboarding");

  return (
    <>
      <h1 className="text-light-1 text-xl">
        Create a new knot
      </h1>

      <PostThread
        userID={userInfo._id}
      />
    </>
  )
}

export default page
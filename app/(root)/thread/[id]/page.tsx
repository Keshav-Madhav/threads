import ThreadCard from "@/components/card/ThreadCard"
import { fetchThreadByID } from "@/lib/actions/Thread.actions"
import { fetchUser } from "@/lib/actions/User.actions"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

type Props = {}

const page = async ({ params }: { params:{id:string} }) => {
  if (!params) return null
  const user = await currentUser();
  if (!user) return null

  const userInfo = await fetchUser(user.id);
  if(!userInfo?.onBoarded) redirect('/onboarding')

    const thread = await fetchThreadByID(params.id)

  return (
    <section className="relative ">
      <div className="">
        <ThreadCard 
          key={thread._id}
          id={thread._id}
          userID={user?.id || ''}
          parentID={thread.parentID}
          content={thread.text}
          author={thread.author}
          createdAt={thread.createdAt}
          community={thread.community}
          comments={thread.children}
        />
      </div>
    </section>
  )
}

export default page
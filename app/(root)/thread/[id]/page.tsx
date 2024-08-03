import ThreadCard from "@/components/card/ThreadCard"
import Comment from "@/components/forms/Comment"
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

      <div className="mt-7 ">
        <Comment 
          threadId={thread._id}
          userImage={userInfo.image}
          userId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className="mt-10 flex flex-col gap-2.5">
        {thread .children.map((comment:any) => (
          <ThreadCard
            key={comment._id}
            id={comment._id}
            userID={user?.id || ''}
            parentID={comment.parentID}
            content={comment.text}
            author={comment.author}
            createdAt={comment.createdAt}
            community={comment.community}
            comments={comment.children}
            isComment
          />
        ))}
      </div>
    </section>
  )
}

export default page
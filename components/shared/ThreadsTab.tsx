import { fetchUserPosts } from "@/lib/actions/User.actions"
import { redirect } from "next/navigation"
import ThreadCard from "../card/ThreadCard"

type Props = {
  currUserId: string
  accountId: string
  accountType: string
}

const ThreadsTab = async ({ currUserId, accountId, accountType }: Props) => {
  let results = await fetchUserPosts(accountId)
  if(!results) return redirect('/')
  console.log(results)

  return (
    <section className="mt-9 flex flex-col gap-10">
      {results.threads.map((thread:any) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          userID={currUserId}
          parentID={thread.parentID}
          content={thread.text}
          author={accountType === 'user' ? {id: results._id, name: results.name, image: results.image} : {id: thread.author.id, name: thread.author.name, image: thread.author.image}}
          createdAt={thread.createdAt}
          community={thread.community}
          comments={thread.children}
        />
      ))}
    </section>
  )
}

export default ThreadsTab
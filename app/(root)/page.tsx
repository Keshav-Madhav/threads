import { getThreads } from "@/lib/actions/Thread.actions";
import { currentUser } from "@clerk/nextjs/server";
import ThreadCard from "@/components/card/ThreadCard";

export default async function Home() {
  const result = await getThreads(1, 30);
  const user = await currentUser();

  console.log(result);
  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No Knots Found</p>
        ) : (
          result.posts.map((thread) => (
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
          ))
        )}
      </section>
    </>
  );
}

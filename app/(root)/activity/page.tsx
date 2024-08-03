import { fetchUser, getActivity } from "@/lib/actions/User.actions"
import { currentUser } from "@clerk/nextjs/server"
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation"

const page = async () => {
  const user = await currentUser();
  if (!user) return null

  const userInfo = await fetchUser(user.id);
  if(!userInfo?.onBoarded) redirect('/onboarding')

    const activities = await getActivity(userInfo._id)

  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activities.length > 0 ? activities.map((activity:any) => (
          <Link
            key={activity._id}
            href={`/thread/${activity.parentID}`}
          >
            <article className="activity-card">
              <Image
                src={activity.author.image}
                alt={activity.author.name}
                width={20}
                height={20}
                className="rounded-full object-cover"
              />
              <p className="!text-small-regular text-light-1 truncate max-w-[70vw]">
                <span className="mr-1 text-primary-500">{activity.author.name}</span>
                {" "}
                replied with
                {" "}
                "{activity.text}"
              </p>
            </article>
          </Link>
        )) : (
          <h1 className="!text-base-regular text-light-3">No activities found</h1>
        )}
      </section>
    </section>
  )
}

export default page
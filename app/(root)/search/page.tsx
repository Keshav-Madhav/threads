
import UserCard from "@/components/card/UserCard";
import { fetchUser, fetchUsers } from "@/lib/actions/User.actions"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const page = async () => {
  const user = await currentUser();
  if (!user) return null

  const userInfo = await fetchUser(user.id);
  if(!userInfo?.onBoarded) redirect('/onboarding')

  const result = await fetchUsers({
    userId: user.id,
    search: '',
    pageNumber: 1,
    pageSize: 25,
  })

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      <div className="mt-14 flex flex-col gap-9">
        {result.users.length > 0 ? result.users.map((user:any) => (
          <UserCard 
            key={user._id}
            id={user._id}
            username={user.username}
            name={user.name}
            image={user.image}
            userType="User"
          />
        )) : <h1 className="text-center">No users found</h1>}
      </div>
    </section>
  )
}

export default page
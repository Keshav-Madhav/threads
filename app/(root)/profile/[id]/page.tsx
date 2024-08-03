import ProfileHeader from "@/components/shared/ProfileHeader"
import ThreadsTab from "@/components/shared/ThreadsTab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { profileTabs } from "@/constants"
import { fetchUser } from "@/lib/actions/User.actions"
import { currentUser } from "@clerk/nextjs/server"
import Image from "next/image"
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

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="tab">
                <Image 
                  src={tab.icon} 
                  alt={tab.label} 
                  width={24} 
                  height={24} 
                  className="object-contain"
                />
                <p className="max-sm:hidden">{tab.label}</p>

                {tab.label === "Threads" && (
                  <p className="ml-1 rounded-md bg-light-4 px-2 py-1 text-tiny-medium text-light-2">{userInfo?.threads?.length}</p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {profileTabs.map((tab) => (
            <TabsContent key={tab.label} value={tab.value} className="w-full text-light-1">
              <ThreadsTab
                currUserId={user.id}
                accountId={userInfo.id}
                accountType="user"
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

export default page
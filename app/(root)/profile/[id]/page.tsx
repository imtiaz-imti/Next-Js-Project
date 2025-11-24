import ProfileHeader from "@/components/shared/ProfileHeader"
import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { profileTabs } from "@/constants"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThreadsTab from "@/components/shared/ThreadsTab"
import SharedTab from "@/components/shared/SharedTab"

const Page = async ({ params } : { params : { id : string } })=>{
  const resolveParams = await params  
  const user = await currentUser()
  if(!user)redirect('/sign-in')
  const userInfo = await fetchUser(resolveParams.id === '%24' ? user.id : resolveParams.id)
  return(
     <section>
        <ProfileHeader
          accountId={userInfo?.id}
          authUserId={user?.id}
          name={userInfo?.name}
          username={userInfo?.username}
          image={userInfo?.image}
          bio={userInfo?.bio}
        />
        <div className='mt-9'>
        <Tabs defaultValue='threads' className='w-full'>
          <TabsList className='tab'>
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className='object-contain'
                />
                <p className='max-sm:hidden'>{tab.label}</p>

                {tab.label === "Threads" ? (
                  <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                    {resolveParams.id === '%24' ? userInfo?.threads.filter((item : typeof userInfo.threads[0])=>userInfo._id?.toString() === item.author?.toString()).length : userInfo?.threads.filter((item : typeof userInfo.threads[0])=>resolveParams.id?.toString() === item.author?.toString()).length}
                  </p>
                ) : 
                  <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                  {resolveParams.id === '%24' ? userInfo?.threads.filter((item : typeof userInfo.threads[0])=>userInfo._id?.toString() !== item.author?.toString()).length : userInfo?.threads.filter((item : typeof userInfo.threads[0])=>resolveParams.id?.toString() !== item.author?.toString()).length}
                   </p>
                
                }
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value='threads' className='w-full text-light-1'>
            <ThreadsTab
              currentUserId={user.id}
              accountId={userInfo?._id}
              accountType='User'
            />
          </TabsContent>

          <TabsContent value='shared' className='w-full text-light-1'>
            <SharedTab
              currentUserId={user.id}
              accountId={userInfo?._id}
              accountType='User'
            />
          </TabsContent>
        </Tabs>
      </div>
     </section>
  )
}
export default Page
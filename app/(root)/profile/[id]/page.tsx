import ProfileHeader from "@/components/shared/ProfileHeader"
import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { profileTabs } from "@/constants"
import Image from "next/image"
import ThreadCard from "@/components/cards/ThreadCard"
import { fetchThreadsByAuthorId } from "@/lib/actions/thread.actions"

const Page = async ({ params } : { params : { id : string } })=>{
  const resolveParams = await params  
  const user = await currentUser()
  if(!user)return null
  const userInfo = await fetchUser(resolveParams.id)
//   if(!userInfo?.onboarded)redirect('/onboarding') 
  const threadsByAuthorId = await fetchThreadsByAuthorId(userInfo._id) 
  console.log(threadsByAuthorId)
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
        <div className="bg-dark-2 mt-10 flex justify-center p-2 rounded-md">
         <div className="flex w-[70%] justify-between">
          {profileTabs.map((item,index)=>
            (<div key={index} className="flex gap-4">
               <Image src={item.icon} alt={item.label} className="object-cover" width={24} height={24}/> 
               <p className="text-light-1">{item.value?.charAt(0).toUpperCase() + item.value?.slice(1)}</p>
               {item.label === 'Threads' && userInfo?.threads?.length > 1 && <div className="bg-light-4 px-2 rounded-sm !text-tiny-medium flex items-center"><p className="text-light-2">{userInfo?.threads?.length}</p></div>}
            </div>)
          )}
         </div>
        </div>
        <div className="mt-10 flex flex-col gap-5">
         {threadsByAuthorId?.map((thread)=> 
          (<ThreadCard key={thread?._id} id={thread?._id} currentUserId={user?.id || ''} parentId={thread.parentId} content={thread.text} author={thread.author} community={thread.community} createdAt={thread.createdAt} comments={thread.children}/>))}
        </div>
     </section>
  )
}
export default Page
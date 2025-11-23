import ThreadCard from "@/components/cards/ThreadCard"
import { fetchUser, getActivity } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const Page = async ()=>{
   const user = await currentUser()
   if(!user)redirect('/sign-in')
   const userInfo = await fetchUser(user.id)
   const activity = await getActivity(userInfo._id) 
   console.log(activity)
   return(
       <section>
          <h1 className="head-text mb-10">Activity</h1>
          <section className="mt-10 flex flex-col gap-5">
            {activity && activity.length > 0 ? <>
               {activity.map((thread)=>(
                 <ThreadCard key={thread?._id} id={thread?._id} currentUserId={userInfo._id || ''} parentId={thread.parentId} content={thread.text} author={thread.author} community={thread.community} createdAt={thread.createdAt} comments={thread.children}/> 
               ))}
            </> : <p className="!text-base-regular text-light-3">No activity yet</p>}
          </section>
       </section>
    )
  }
  
  export default Page
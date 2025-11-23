import ThreadCard from "@/components/cards/ThreadCard"
import { fetchThreadById } from "@/lib/actions/thread.actions"
import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Comment from "@/components/forms/Comment"
const Page = async ({ params } : { params : { id : string }})=>{
    const resolveParams = await params
    if(!resolveParams.id)return null 
    const user = await currentUser()
    if(!user)return null
    const userInfo = await fetchUser(user.id)
    if(!userInfo?.onboarded)redirect('/onboarding')
    const thread = await fetchThreadById(resolveParams.id)   
    return(
      <section className="relative">
       <div>
         <ThreadCard id={thread?._id} currentUserId={user?.id || ''} parentId={thread.parentId} content={thread.text} author={thread.author} community={thread.community} createdAt={thread.createdAt} comments={thread.children}/>
       </div>
        <div className="mt-7 w-full">
          <Comment threadId={thread?._id.toString()} currentUserImg={user.imageUrl} currentUserId={userInfo._id.toString()}/>
        </div>
        <div className="mt-10 flex flex-col gap-10">
          {thread.children.map((childrenItem : typeof thread,index : number)=>
            (<ThreadCard key={index} id={childrenItem?._id} currentUserId={childrenItem?.id || ''} parentId={childrenItem.parentId} content={childrenItem.text} author={childrenItem.author} community={childrenItem.community} createdAt={childrenItem.createdAt} comments={childrenItem.children} isComment/>)  
          )}
        </div>
      </section>
    )
}
export default Page
import { fetchAllChildThreads, fetchThreadById } from "@/lib/actions/thread.actions"
import { formatDateString } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { currentUser } from "@clerk/nextjs/server"
import { fetchUser, getActivity } from "@/lib/actions/user.actions"

interface props {
    id : string,
    currentUserId? : string,
    parentId? : string | null,
    content : string,
    author : {
        id : string,
        name : string,
        image : string
    },
    community : {
        id : string,
        name : string,
        image : string 
    } | null,
    createdAt : string,
    comments : {
        author : {
           image : string 
        }
    }[]
    isComment? : boolean
}
const ThreadCard = async ({id,content,author,community,createdAt,isComment} : props)=>{
    const user = await currentUser()
    const userInfo = await fetchUser(user?.id || '')
    const childThreads = await fetchAllChildThreads(id)
    const allThread = await getActivity(userInfo._id)
    const repliedThread = await fetchThreadById(id) 
    console.log(repliedThread)
    return(
       <article className={`flex flex-col w-full rounded-xl ${isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p-7'}`}>
        <div className="flex items-start justify-between">
           <div className="flex w-full flex-1 flex-row gap-4">
               <div className="flex items-center gap-5">
                 <div className="flex flex-col items-center">
                  <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
                   <Image src={author.image} alt="Profile Image" fill className="cursor-pointer rounded-full"/>
                  </Link>
                  <div className="thread-card_bar"></div>
                 </div>
                 <div className="flex w-full flex-col">
                 <Link href={`/profile/${author.id}`} className="w-fit">
                   <h4 className="cursor-pointer text-base-semibold text-light-1">{author.name}</h4>
                 </Link>
                 <p className="mt-2 text-small-regular text-light-2">{content}</p>
                 <div className="mt-5 flex flex-col gap-3">
                   {userInfo?.threads.some((item : typeof userInfo.threads[0])=>item.id.toString() === id.toString() && userInfo?._id.toString() === item.author.toString()) ? <p className="text-gray-1 text-subtle-medium">You’ve created this thread</p> : allThread?.some((item : typeof allThread[0])=>item.id.toString() === id.toString() && item.author?._id.toString() === userInfo?._id.toString()) ? <p className="text-gray-1 text-subtle-medium">You’ve replied on <Link href={`/thread/${repliedThread?.parentId}`} className="text-blue">@thread</Link></p> : <div className="flex gap-3.5">
                     <Link href={`/thread/${id}`}>
                       <Image src='/assets/reply.svg' alt="reply" width={24} height={24}     className="cursor-pointer object-contain"/>
                     </Link>
                     <Link href={`/share-thread/${id}`}>
                       <Image src='/assets/repost.svg' alt="repost" width={24} height={24}     className="cursor-pointer object-contain"/>
                     </Link>
                   </div>}  
                 </div>   
                </div>
               </div>
           </div>
        </div>
        {/* @ts-expect-error: third-party type definitions are wrong */}
        {childThreads.children.length > 0 && <Link href={`/thread/${id}`} className="flex items-center gap-8 ml-3 mt-2">
          {/* @ts-expect-error: third-party type definitions are wrong */}
          <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">{childThreads.children.map((item,index)=>(
            <Image key={index} src={item.author.image} alt="profile photo" className= "rounded-full object-cover" fill/>
          ))}</div>
          {/* @ts-expect-error: third-party type definitions are wrong */} 
          <p className="text-gray-1 text-small-regular">{childThreads.children.length} replies</p>
        </Link>}
        {!isComment && community ? (
          <Link href={`/communities/${community.id}`} className="mt-5 flex items-center">
            <p className="text-subtle-medium text-gray-1">
              {formatDateString(createdAt)} - {community.name} Community
            </p>
            <div className="relative h-4 w-4 ml-2">
              <Image src={community.image} alt={community.name} fill className="rounded-full"/>
            </div>
          </Link>
        ) : !isComment && (<div className="mt-5 flex items-center">
          <p className="text-subtle-medium text-gray-1">
            {formatDateString(createdAt)}
          </p>
        </div>)}
       </article> 
    )
}
export default ThreadCard
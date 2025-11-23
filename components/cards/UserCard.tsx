'use client'

import Image from "next/image"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { shareThread } from "@/lib/actions/user.actions"
import { useEffect, useState } from "react"
import { userInDet } from "@/lib/searchValue"

interface props {
    id:string,
    name:string,
    username:string,
    imgUrl:string,
    personType?:string,
    buttonValue?:string,
    threadId?:string
}
const UserCard = ({id,name,username,imgUrl,buttonValue,threadId} : props) => {
  const router = useRouter()
  const [shared,setShared] = useState(0)
  const [author,setAuthor] = useState(0)
  useEffect(()=>{
    async function userDetails(){
      const userInfo = await userInDet(id)
      const threadAuthor = userInfo.threads.some((item : typeof userInfo.threads[0])=> item._id?.toString() === threadId?.toString() && userInfo._id?.toString() === item.author?.toString())
      const threadShared = userInfo.threads.some((item : typeof userInfo.threads[0])=> item._id?.toString() === threadId?.toString() && userInfo._id?.toString() !== item.author?.toString())
      setAuthor(threadAuthor)
      setShared(threadShared)
    }
    userDetails()
  },[])
  const shareToUser = async ()=>{
    if(author || shared)return
    await shareThread(id,threadId || '')
    setShared(1)
  }
  return (
    <article className="user-card">
       <div className="user-card_avatar">
          <div className="relative w-11 h-11 rounded-full">
            <Image src={imgUrl} alt='logo' fill className='object-cover rounded-full'/>
          </div>
          <div className="flex-1 text-ellipsis">
            <h4 className="text-base-semibold text-light-1">{name}</h4>
            <p className="text-small-medium text-gray-1">@{username}</p>
          </div>
       </div>
       <Button className={author || shared ? `user-card_btn cursor-text` : `user-card_btn`} onClick={buttonValue === 'Share' ? shareToUser : ()=>router.push(`/profile/${id}`)}>
          {author ? 'author of this thread' : shared ? 'shared' : buttonValue === 'Share' ? 'Share' : 'View'}
       </Button>
    </article>
  )
}

export default UserCard

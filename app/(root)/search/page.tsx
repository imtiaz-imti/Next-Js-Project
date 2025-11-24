'use client'

import { useState } from "react"
import UserCard from "@/components/cards/UserCard"
import Image from "next/image"
import { onSearch,user} from "@/lib/searchValue"
import { redirect } from "next/navigation"
import CommunityCard from "@/components/cards/CommunityCard"

interface props {
  users : [{
     _id : string,
     name : string,
     username : string,
     image : string
  }],
  communities : [{
    id : string,
    name : string,
    username : string,
    image : string,
    bio : string,
    members: {
      image: string;
    }[]
 }]
}
const Page = ()=>{  
  if(!user)redirect('/sign-in')
  const [searchData,setSearchData] = useState<props>()
  const [message,setMessage] = useState('') 
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // prevent page reload

    const formData = new FormData(e.currentTarget);

    // Call the server action manually
    const data = await onSearch(formData);
    setSearchData(data)
    if(data?.users.length === 0 && data?.communities.length === 0){
      setMessage('No users or communities found')
    }
  }      
  return(
     <section>
        <h1 className="head-text mb-10">Search</h1>
        <form className="bg-white flex rounded-lg pl-4" onSubmit={handleSubmit}>
          <input name='searchValue' type="text" placeholder='search user or community' autoComplete='off' className="border-none outline-none w-[95%] h-[50px]"/>
          <button type="submit" className="bg-gray-1 w-[10%] rounded-r-lg flex items-center justify-center cursor-pointer"><Image src='/icons8-search-30.png' alt="search" width={24} height={24}/></button>
        </form>
        <div className="mt-14 flex flex-col gap-9">
          {(searchData?.users?.length || 0) === 0 && (searchData?.communities?.length || 0) === 0 ? (<p className="no-result">{message}</p>) : <>
            {searchData?.users?.map((person)=>(<UserCard key={person._id} id={person._id} name={person.name} username={person.username} imgUrl={person.image} personType='User' />))}
            {searchData?.communities?.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                imgUrl={community.image}
                bio={community.bio}
                members={community.members}
              />
            ))}
            </>
          }
        </div>
     </section>
  )
}

export default Page
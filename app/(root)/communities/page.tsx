'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import { allCommunity, onSearch,user} from "@/lib/searchValue"
import { redirect } from "next/navigation"
import CommunityCard from "@/components/cards/CommunityCard"

interface props {
  users? : [{
     id : string,
     name : string,
     username : string,
     image : string
  }],
  communities? : [{
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

interface propsCom{
  id : string,
  name : string,
  username : string,
  image : string,
  bio : string,
  members: {
    image: string;
  }[]
}
const Page = ()=>{  
  if(!user)redirect('/sign-in')
  const [searchData,setSearchData] = useState<props>()
  const [communitiesData,setCommunitiesData] = useState<propsCom[]>()
  const [message,setMessage] = useState('') 
  useEffect(()=>{
     async function allData(){
       const data = await allCommunity()
       setCommunitiesData(data)
     }
     allData()
  },[])
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // prevent page reload

    const formData = new FormData(e.currentTarget);

    // Call the server action manually
    setCommunitiesData([])
    const data = await onSearch(formData);
    setSearchData(data)
    if(data?.communities.length === 0){
      setMessage('No communities found')
    }
  }      
  return(
     <section>
        <h1 className="head-text mb-10">Communities</h1>
        <form className="bg-white flex rounded-lg pl-4" onSubmit={handleSubmit}>
          <input name='searchValue' type="text" placeholder='search community' autoComplete='off' className="border-none outline-none w-[95%] h-[50px]"/>
          <button type="submit" className="bg-gray-1 w-[10%] rounded-r-lg flex items-center justify-center cursor-pointer"><Image src='/icons8-search-30.png' alt="search" width={24} height={24}/></button>
        </form>
        <div className="mt-14 flex flex-wrap gap-9">
          {(searchData?.communities?.length || 0) === 0 ? ((communitiesData?.length || 0) === 0 ? <p className="no-result">{message}</p> : <>
          {communitiesData?.map((community) => (
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
          </>) : <>
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
'use client'

import { useState,useEffect } from "react"
import UserCard from "@/components/cards/UserCard"
import Image from "next/image"
import { onSearch,user,usersToShare } from "@/lib/searchValue"
import { redirect } from "next/navigation"

interface props {
  users : [{
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
const Page = ({ params } : { params : { id : string } })=>{ 
  const [searchData,setSearchData] = useState<props>()
  const [param,setParam] = useState<{id : string}>()
  useEffect(() => {
    async function users(){
      const currentUser = await user()
      if(!currentUser)redirect('/sign-in')
      const resolveParams = await params
      setParam(resolveParams)  
      const result = await usersToShare()
      setSearchData(result)
    }
    users()
  },[]);
  const [message,setMessage] = useState('') 
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // prevent page reload

    const formData = new FormData(e.currentTarget);

    // Call the server action manually
    const data = await onSearch(formData);
    setSearchData(data)
    if(data?.users.length === 0){
      setMessage('No users found')
    }
  }      
  return(
     <section>
        <h1 className="head-text mb-10">Share Thread</h1>
        <form className="bg-white flex rounded-lg pl-4" onSubmit={handleSubmit}>
          <input name='searchValue' type="text" placeholder='search user to share thread' autoComplete='off' className="border-none outline-none w-[95%] h-[50px]"/>
          <button type="submit" className="bg-gray-1 w-[10%] rounded-r-lg flex items-center justify-center cursor-pointer"><Image src='/icons8-search-30.png' alt="search" width={24} height={24}/></button>
        </form>
        <div className="mt-14 flex flex-col gap-9">
          {(searchData?.users?.length || 0) === 0 ? (<p className="no-result">{message}</p>) : <>
            {searchData?.users?.map((person)=>(<UserCard key={person.id} id={person.id} name={person.name} username={person.username} imgUrl={person.image} personType='User' buttonValue='Share' threadId={param?.id}/>))}
          </>
          }
        </div>
     </section>
  )
}

export default Page
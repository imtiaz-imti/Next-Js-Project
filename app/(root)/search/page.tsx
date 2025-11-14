import { fetchUser, fetchUsers } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs/server"
import UserCard from "@/components/cards/UserCard"

const Page = async ()=>{  
  const user = await currentUser()
  if(!user)return null
  const userInfo = await fetchUser(user.id)
  const threadUsers = await fetchUsers({
    userId : userInfo._id,
    searchString : '',
    pageNumber : 1,
    pageSize : 20
  }) 
  return(
     <section>
        <h1 className="head-text mb-10">Search</h1>
        <div className="mt-14 flex flex-col gap-9">
          {threadUsers?.users.length === 0 ? (<p className="no-result">No users</p>) : <>
            {threadUsers?.users.map((person)=>(<UserCard key={person.id} id={person.id} name={person.name} username={person.username} imgUrl={person.image} personType='User' />))}</>
          }
        </div>
     </section>
  )
}

export default Page
import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";

export default async function Page(){
    const user = await currentUser()
    if(!user)redirect('/sign-in') 
    const userInfo = await fetchUser(user.id)     
    const { id,firstName,lastName,username } = {...user}
    const userActive = {
      id : id || '',
      objectId : '',
      username : username || '',
      name : `${firstName}  ${lastName}` || '',
      bio : userInfo.bio,
      image : userInfo.image || ''
    }
    return (
       <main className="mx-auto flex flex-col max-w-3xl px-10 py-20">
          <section className="mt-9 bg-dark-2 p-10">
            <AccountProfile user={userActive}/>
          </section>
       </main>  
    )
}
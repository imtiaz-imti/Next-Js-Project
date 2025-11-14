import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs/server";

export default async function Page(){
    const user = await currentUser()
    console.log(user)
    const { id,firstName,lastName,imageUrl,username } = {...user}
    const userActive = {
      id : id || '',
      objectId : '',
      username : username || '',
      name : `${firstName}  ${lastName}` || '',
      bio : '',
      image : imageUrl || ''
    }
    return (
       <main className="mx-auto flex flex-col max-w-3xl px-10 py-20">
          <section className="mt-9 bg-dark-2 p-10">
            <AccountProfile user={userActive}/>
          </section>
       </main>  
    )
} 
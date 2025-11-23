import { fetchCommunities } from "@/lib/actions/community.actions"
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs/server"
import Image from "next/image"
import Link from "next/link"

async function RightSideBar() {
    const user = await currentUser()
    const suggestedUsers = await fetchUsers({userId : user?.id || ''})
    const userInfo = await fetchUser(user?.id || '')
    const suggestedCommunities = await fetchCommunities({userId : userInfo._id || ''})
    return (
      <section className="custom-scrollbar rightsidebar">
        <div className="flex flex-col flex-1 justify-start gap-5">
          <h3 className="text-heading4-medium text-light-1">Suggested Communities</h3>
          <div className="flex gap-5">
            {suggestedCommunities?.communities.map((suggestedCommunity,index)=>(
             <Link key={index} href={`/communities/${suggestedCommunity.id}`}>
              <div className="relative w-11 h-11 rounded-full">
                <Image src={suggestedCommunity.image} alt='logo' fill className='object-cover rounded-full'/>
              </div>
            </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col flex-1 justify-start gap-5">
          <h3 className="text-heading4-medium text-light-1">Suggested Users</h3>
          <div className="flex gap-5">
            {suggestedUsers?.users.map((suggestedUser,index)=>(
             <Link key={index} href={`/profile/${suggestedUser._id}`}>
              <div className="relative w-11 h-11 rounded-full">
                <Image src={suggestedUser.image} alt='logo' fill className='object-cover rounded-full'/>
              </div>
            </Link>
            ))}
          </div>
        </div>
      </section>
    )
  }
  
export default RightSideBar
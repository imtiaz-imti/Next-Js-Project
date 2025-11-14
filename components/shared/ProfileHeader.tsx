import Image from "next/image"

interface props {
    accountId : string,
    authUserId : string,
    name : string,
    username : string,
    image : string,
    bio : string
}

const ProfileHeader = ({accountId,authUserId,name,username,image,bio} : props)=>{
  return(
    <section>
      <div className="bg-dark-1">
       <div className="flex gap-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden">
            <Image src={image} alt="Profile Image" fill className="object-cover"/>    
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-light-1 text-left text-heading3-bold">{name}</h1>
            <h1 className="text-base-medium text-gray-1">{username}</h1>  
          </div> 
       </div>
       <p className="mt-6 text-small-regular font-bold text-gray-300">{bio}</p>
      </div>
    </section>
  )
}

export default ProfileHeader
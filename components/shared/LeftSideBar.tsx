'use client'
import { sidebarLinks } from "@/constants"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignedIn, SignOutButton } from "@clerk/nextjs"

function LeftSideBar() {
    const pathName = usePathname() 
    return (
      <section className="custom-scrollbar leftsidebar">
        <div className="flex w-full flex-1 flex-col gap-6 px-6">
          {sidebarLinks.map((link,index)=> { 
           const isActive = (pathName.includes(link.route) && link.route.length > 1) || pathName === link.route 
           return ( 
            <Link key={index} href={link.route} className={`leftsidebar_link ${isActive && 'bg-primary-500'}`}>
              <Image src={link.imgURL} alt={link.label} width={24} height={24}/>
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </Link>)
          })}
        </div>
        <div className="mt-10 px-6">
            <SignedIn>
               <SignOutButton signOutOptions={{redirectUrl: '/sign-in'}}>
                 <div className="cursor-pointer flex gap-4 p-4">
                    <Image src='/assets/logout.svg' alt="logout" width={24} height={24}/>
                    <p className="text-light-2 max-lg:hidden">Logout</p>
                 </div> 
               </SignOutButton> 
            </SignedIn>
        </div>
      </section>
    )
  }
  
export default LeftSideBar
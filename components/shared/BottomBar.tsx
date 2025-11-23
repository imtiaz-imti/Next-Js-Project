'use client'
import { sidebarLinks } from "@/constants"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"


function BottomBar() {
    const pathName = usePathname()
    return (
      <section className="bottombar">
        <div className="bottombar_container">
        {sidebarLinks.map((link,index)=> { 
           const isActive = pathName.includes('/communities/') ? false : (pathName.includes('/profile/$') && link.label === 'Profile' ? true : (pathName.includes('/profile/') ? false :(pathName.includes(link.route) && link.route.length > 1) || pathName === link.route)) 
           return ( 
            <Link key={index} href={link.route === '/profile' ? link.route + `/$` : link.route} className={`leftsidebar_link ${isActive && 'bg-primary-500'}`}>
              <Image src={link.imgURL} alt={link.label} width={24} height={24}/>
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </Link>)
          })}
        </div>
      </section>
    )
  }
  
export default BottomBar
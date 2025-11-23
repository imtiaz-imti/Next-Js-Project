'use server'

import { currentUser } from "@clerk/nextjs/server"
import { fetchUser, fetchUserAndCommunity,fetchUsers} from "./actions/user.actions"

export async function onSearch(formData : FormData){
    const result = await fetchUserAndCommunity(formData.get('searchValue') as string)
    return result
}

export async function user(){
   const user = await currentUser() 
   const currentAuthUser = JSON.parse(JSON.stringify(user))
   return currentAuthUser
}

export async function usersToShare(){
    const user = await currentUser()
    const users = await fetchUsers({userId : user?.id || ''}) 
    const currentUsers = JSON.parse(JSON.stringify(users))
    return currentUsers
}

export async function userInDet(id : string){
    const user = await fetchUser(id) 
    const currentUserInfo = JSON.parse(JSON.stringify(user))
    return currentUserInfo
}
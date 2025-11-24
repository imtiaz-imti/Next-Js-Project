'use server'

import { currentUser } from "@clerk/nextjs/server"
import { fetchUser, fetchUserAndCommunity,fetchUsers} from "./actions/user.actions"
import { fetchCommunities, fetchEveryCommunities } from "./actions/community.actions"

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

export async function allCommunity(){
    const user = await currentUser()
    const userInfo = await fetchUser(user?.id || '')
    const result = await fetchEveryCommunities(userInfo?._id || '')
    const allResult = JSON.parse(JSON.stringify(result))
    return allResult
}
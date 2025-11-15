'use server'

import { revalidatePath } from "next/cache"
import Thread from "../models/thread.model"
import User from "../models/user.model"
import Community from "../models/community.model"
import { connectToDB } from "../mongoose"

interface Params {
   text : string,
   author : string,
   communityId : string | null,
   path : string
}

export async function createThread({text,author,communityId,path} : Params){
 try {
    await connectToDB()
    const createThread = await Thread.create({text,author,community : communityId})
    await User.findOneAndUpdate({author},{
      $push : {threads : createThread._id}
    })
    await Community.findOneAndUpdate({communityId},{
      $push : {threads : createThread._id}
    })
    revalidatePath(path)
  } catch (error) {
    if (error instanceof Error) {
        throw new Error(`Failed to create/update thread ${error.message}`)
    } else {
        console.error('Unknown error', error)
    }
  }
}

export async function fetchThreads(pageNumber = 1, pageSize = 20){
  try {
    await connectToDB()
    const skipAmount = (pageNumber - 1) * pageSize
    const threadsQuery = Thread.find({parentId : {$in : [null,undefined]}}).
    sort({createdAt : 'desc'}).skip(skipAmount).limit(pageSize).populate({path : 'author',model : User}).populate({
        path : 'children',
        populate : {
          path : 'author',
          model : User,
          select : '_id name parentId image'
        }
    })
    const totalThreadsCount = await Thread.countDocuments({parentId : {$in : [null,undefined]}})
    const threads = await threadsQuery.exec()
    const isNext = totalThreadsCount > skipAmount + threads.length
    return {threads,isNext}  
  } catch (error) {
    if (error instanceof Error) {
        throw new Error(`Failed to fetch thread ${error.message}`)
    } else {
        console.error('Unknown error', error)
    }
  }

}

export async function fetchThreadById(id : string){
  try {
    await connectToDB()
    const thread = await Thread.findById(id).populate({
      path : 'author',
      model : User,
      select : '_id id name image'
    }).populate({
      path : 'children',
      populate : [{
        path : 'author',
        model : User,
        select : '_id id name parentId image'
      },{
        path : 'children',
        model : Thread,
        populate : {
          path : 'author',
          model : User,
          select : '_id id name parentId image'
        }
      }]
    })
    return thread
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch thread ${error.message}`)
    } else {
      console.error('Unknown error', error)
    }
  }
}

export async function addComentToThread(threadId : string,commentText : string,userId : string,path : string){
  try {
    await connectToDB()
    const orginalThread = await Thread.findById(threadId)
    if(!orginalThread)throw new Error('Thread not found')
    const commentThread = new Thread({
       text : commentText,
       author : userId,
       parentId : threadId
    })   
    const savedCommentThread = await commentThread.save()
    orginalThread.children.push(savedCommentThread._id)
    await orginalThread.save()
    revalidatePath(path)
  } catch (error) {
    if (error instanceof Error) {
        throw new Error(`Failed to adding comment to thread ${error.message}`)
    } else {
        console.error('Unknown error', error)
    }
  }
} 
export async function fetchThreadsByAuthorId(id : string){
  try {
    await connectToDB()
    const threadsByAuthor = await Thread.find({parentId : {$in : [null,undefined]},author : id}).
    sort({createdAt : 'desc'}).populate({
       path : 'author',
       model : User
    })
    return threadsByAuthor
  } catch (error) {
    if (error instanceof Error) {
        throw new Error(`Failed to fetch thread by author ${error.message}`)
    } else {
        console.error('Unknown error', error)
    }
  }

}

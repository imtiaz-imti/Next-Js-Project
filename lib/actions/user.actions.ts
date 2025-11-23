"use server";

import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";

import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";

import { connectToDB } from "../mongoose";

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    const user = await User.findOne({ id: userId }).populate({
      path: "communities",
      model: Community,
    }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path : 'community',
        model : Community
      }
    });
    if(!user){
      return await User.findOne({ _id: userId }).populate({
        path: "communities",
        model: Community,
      }).populate({
        path: "threads",
        model: Thread,
        populate: {
          path : 'community',
          model : Community
        }
      });
    }
    return user
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch user ${error.message}`)
    } else {
      console.error('Unknown error', error)
    }
  }
}

export async function updateUser(userId: string,username: string,name: string,bio: string,    image: string,path: string): Promise<void> {
  try {
    connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update user ${error.message}`)
    } else {
      console.error('Unknown error', error)
    }
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    // Find all threads authored by the user with the given userId
    const threads = await User.findOne({$or : [{ id: userId },{ _id: userId }]}).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "community",
          model: Community,
          select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id", // Select the "name" and "_id" fields from the "User" model
          },
        },
      ],
    });
    return threads;
  } catch (error) {
    console.error("Error fetching user threads:", error);
    throw error;
  }
}

// Almost similar to Thead (search + pagination) and Community (search + pagination)
export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    // Calculate the number of users to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter users.
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // Exclude the current user from the results.
    };

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched users based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Count the total number of users that match the search criteria (without pagination).
    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    // Check if there are more users beyond the current page.
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB()
    const userThreads = await Thread.find({ author: userId }).populate({
      path : 'author',
      model : User
    }).populate({
      path : 'community',
      model : Community
    })
    return userThreads
  } catch (error) {
    console.error("Error fetching activity: ", error);
    throw error;
  }
}

export async function fetchUserAndCommunity(value : string) {
  try {
    connectToDB()
    console.log(value)
    const query = new RegExp(value, "i");
    const usersData = await User.find({
    $or: [{ name: query }, { username: query }],
    })    
    const communitiesData = await Community.find({
    $or: [{ name: query }, { username: query }],
    }).populate([{
       path : 'members',
       model : User
    }])
    const users = JSON.parse(JSON.stringify(usersData));
    const communities = JSON.parse(JSON.stringify(communitiesData));
    return { users, communities };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch user and community${error.message}`)
    } else {
      console.error('Unknown error', error)
    }
  }
}
export async function createUser(id : string,firstName : string,lastName : string,username : string,imageUrl : string) {
  try {
    connectToDB()
    await User.create({
       id,
       name : firstName + lastName,
       username,
       imageUrl,
       bio : '',
       threads : [],
       onboarded : false,
       communities : []
    })
    
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create user ${error.message}`)
    } else {
      console.error('Unknown error', error)
    }
  }
}

export async function shareThread(userId : string,threadId : string): Promise<void> {
  try {
    connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        $push: { threads : threadId }
      }
    )
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update user ${error.message}`)
    } else {
      console.error('Unknown error', error)
    }
  }
}

export async function fetchUserForShared(userId: string) {
  try {
    connectToDB();

    return await User.findById({ _id : userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path : 'author',
        model : User
      }
    }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path : 'community',
        model : Community
      }
    })
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch user ${error.message}`)
    } else {
      console.error('Unknown error', error)
    }
  }
}
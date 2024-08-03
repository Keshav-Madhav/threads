"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectDB } from "../mongoose"
import Thread from "../models/thread.modal";
import { FilterQuery, SortOrder } from "mongoose";

export async function updateUser(userId:string, username:string, name:string, bio:string, image:string, path:string): Promise<void> {
  connectDB();

  try {
    await User.findOneAndUpdate(
      {id: userId}, 
      {
        username:username.toLowerCase(),
        name,
        bio,
        image,
        onBoarded: true,
      },
      {upsert:true}
    );
  
    if(path === '/profile/edit'){
      revalidatePath(path);
    }
  } catch (error) {
    console.error(error);
    throw new Error('Error updating user');
  }
}

export async function fetchUser(userID:string){
  try{
    connectDB();

    return await User.findOne({id:userID})
    // .populate({path:'communities', modal:Community})
  }catch(error){
    console.error(error);
    throw new Error('Error creating thread');
  }
}

export async function fetchUserPosts(userID:string){
  connectDB();  
  
  try {
    const threads = await User.findOne({ id: userID })
      .populate({ path: 'threads', model: Thread, populate:{ path: 'children', model: Thread, populate: { path: 'author', model: User, select:{path:'author', model: User, select:'name image id'}}} })

    return threads;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching user posts');
  }

}

export async function fetchUsers({
  userId,
  search = '',
  pageNumber = 1,
  pageSize = 20,
  sortBy = 'desc',
}: {userId: string; search?: string; pageNumber?: number; pageSize?: number; sortBy?: SortOrder;}){
  connectDB();

  try {
    const skipAmount = (pageNumber - 1) *  pageSize;

    const userRegex = new RegExp(search, 'i');

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    }

    if(search.trim() !== ''){
      query.$or = [
        {username: {$regex: userRegex}},
        {name: {$regex: userRegex}},
      ]
    }

    const sortOptions = {CreatedAt: sortBy}

    const usersQuery = User.find(query).sort(sortOptions).skip(skipAmount).limit(pageSize);

    const totalCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const isNext = totalCount > skipAmount + users.length;

    return {users, isNext, totalCount};
  } catch (error) {
    console.log(error)
    throw new Error('Error fetching users');
  }
}

export async function getActivity(userID:string){
  connectDB();

  try {
    const threads = await Thread.find({author: userID})

    const childrenThreads = threads.reduce((acc, thread) => {
      return acc.concat(thread.children)
    }, [])

    const replies = await Thread.find({_id: {$in: childrenThreads}, author: {$ne: userID}})
      .populate({path: 'author', model: User, select:'name image _id'})

    return replies;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching activity');
  }
}
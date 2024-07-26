"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectDB } from "../mongoose"

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
    console.error('Error updating user: ', error);
    throw new Error('Error updating user');
  }
}

export async function fetchUser(userID:string){
  try{
    connectDB();

    return await User.findOne({id:userID})
    // .populate({path:'communities', modal:Community})
  }catch(error){
    console.error('Error creating thread: ', error);
    throw new Error('Error creating thread');
  }
}
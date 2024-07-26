"use server"

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.modal";
import User from "../models/user.model";
import { connectDB } from "../mongoose"

export async function createThread(text:string, author:string, path:string, communityID: string | null): Promise<void> {
  connectDB();

  try {
    const thread = await Thread.create({
      text,
      author,
      community: null,
    });
  
    await User.findByIdAndUpdate(author, {
      $push: { threads: thread._id }
    });
  
    revalidatePath(path);
  } catch (error) {
    console.error('Error creating thread: ', error);
    throw new Error('Error creating thread');
  }
}
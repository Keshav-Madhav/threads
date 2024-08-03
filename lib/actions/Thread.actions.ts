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

export async function getThreads(pageNum = 1, pageSize = 20) {
  connectDB();
  
  const skipAmt = (pageNum - 1) * pageSize;

  const threads = Thread.find({
    parentID: {$in: [null, '', undefined]},
  })
  .sort({createdAt: 'desc'})
  .skip(skipAmt)
  .limit(pageSize)
  .populate({path: 'author', model: User})
  .populate({path: 'children',populate:{path:'author', model:User, select:"_id name parentID image"}})

  const totalCount = await Thread.countDocuments({
    parentID: {$in: [null, '', undefined]},
  })

  const posts = await threads.exec();

  const isNextPage = totalCount > (skipAmt + posts.length);

  return {posts, isNextPage};
}
"use server"

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.modal";
import User from "../models/user.model";
import { connectDB } from "../mongoose"
import Community from "../models/community.model";

export async function createThread(text:string, author:string, path:string, communityID: string | null): Promise<void> {
  connectDB();

  try {
    const communityIdObject = await Community.findOne(
      { id: communityID },
      { _id: 1 }
    );

    const thread = await Thread.create({
      text,
      author,
      community: communityIdObject,
    });

    console.log('Thread created: ', thread);
    console.log('Community ID: ', communityIdObject);
    console.log(communityID);
  
    await User.findByIdAndUpdate(author, {
      $push: { threads: thread._id }
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { threads: thread._id },
      });
    }
  
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
  .populate({path: "community", model: Community,})
  .populate({path: 'children',populate:{path:'author', model:User, select:"_id name parentID image"}})

  const totalCount = await Thread.countDocuments({
    parentID: {$in: [null, '', undefined]},
  })

  const posts = await threads.exec();

  const isNextPage = totalCount > (skipAmt + posts.length);

  return {posts, isNextPage};
}

export async function fetchThreadByID(id: string) {
  connectDB();

  try {
    const thread = await Thread.findById(id)
    .populate({ path: 'author', model: User, select:"_id id name image" })
    .populate({ path: "community", model: Community, select: "_id id name image" })
    .populate({ path: 'children', populate:[
      {path:'author', model:User, select:"_id name parentID image"},
      {path:'children', model:Thread, populate:{path:'author', model:User, select:"_id name parentID image"}}
    ]}).exec();

    return thread;
  } catch (error) {
    console.error('Error fetching thread: ', error);
    throw new Error('Error fetching thread');
  }
}

export async function addComment(text: string, userID: string, threadID: string, path: string) {
  connectDB();

  try {
    const originalThread = await Thread.findById(threadID);
    if (!originalThread) throw new Error('Thread not found');

    const commentThread = new Thread({
      text,
      author: userID,
      ParentID: threadID,
    })

    const savedComment = await commentThread.save(); 

    originalThread.children.push(savedComment._id);

    await originalThread.save();
  
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw new Error('Error creating thread');
  }
}

async function fetchAllChildThreads(threadId: string): Promise<any[]> {
  const childThreads = await Thread.find({ parentId: threadId });

  const descendantThreads = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread._id);
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
}

export async function deleteThread(id: string, path: string): Promise<void> {
  try {
    connectDB();

    // Find the thread to be deleted (the main thread)
    const mainThread = await Thread.findById(id).populate("author community");

    if (!mainThread) {
      throw new Error("Thread not found");
    }

    // Fetch all child threads and their descendants recursively
    const descendantThreads = await fetchAllChildThreads(id);

    // Get all descendant thread IDs including the main thread ID and child thread IDs
    const descendantThreadIds = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child threads and their descendants
    await Thread.deleteMany({ _id: { $in: descendantThreadIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}
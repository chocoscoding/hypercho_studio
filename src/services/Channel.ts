import { ObjectId } from "mongodb";
import { Aggregate } from "mongoose";
import logg from "../Logs/Customlog";
import { Channel, Comment, Reply, User, Video } from "../models";
import { EditChannelInfoTypes, ResultTypes } from "../types/main";
import { custom } from "./custom";
import dotenv from "dotenv";
dotenv.config();

//function to add a new channel
export const add_NewChannel = async (userId: string, channelName: string): Promise<ResultTypes> => {
  const username: string = channelName.replace(new RegExp(" ", "g"), "").trim().toLowerCase(); //check if the channelname exist
  const userHasChannel = Channel.find({ userRef: userId }); //check if the user already has a channel
  const nameExist = Channel.find({ username });
  const init = await Promise.allSettled([userHasChannel, nameExist]); //run all async request in parrallel
  if (init[0].status === "fulfilled" && init[1].status === "fulfilled") {
    const HAS_CHANNEL = init[0].value[0];
    const NAME_EXIST = init[1].value[0];
    if (HAS_CHANNEL) {
      //if the username is already has a channel
      return { success: false, code: 403, error: `You can't have 2 channels for now` };
    }
    if (NAME_EXIST) {
      //if the username is already in use
      return { success: false, code: 403, error: `This name is already taken` };
    }
    //if the 2 checks passed
    try {
      const newChannel = new Channel({
        username,
        userRef: userId,
        channelName,
      });
      const data = await newChannel.save(); //save the data
      await User.updateOne({_id: userId},{channel: new ObjectId(data._id)})
      return { success: true, code: 200, data };
    } catch (e: any) {
      //error that occured while adding the document
      logg.fatal(e.message);
      return { success: true, code: 200, error: "Something went wrong , try again later" };
    }
  }
  return { success: false, code: 404, error: `something went wrong, check the data supplied and try again` }; //if the test wasnt passed
};

//function to edit channel info
export const edit_ChannelInfo = async ({
  channelId,
  channelName,
  channelPic,
  channelBanner,
}: EditChannelInfoTypes): Promise<ResultTypes> => {
  try {
    //conditionally add the values that are to be changed
    const new_username = channelName && channelName.replace(new RegExp(" ", "g"), "").trim().toLowerCase();
    const editingData = {
      ...(channelPic && { channelPic }),
      ...(channelBanner && { channelBanner }),
      ...(channelName && { channelName, username: new_username }),
    };

    if (channelName) {
      //if the channel name was provided
      const nameExist = await Channel.find({ username:new_username });
      if (nameExist.length > 0) {
        //if the name exist already
        return { success: false, code: 403, error: `This name is already taken` };
      }
    }
    let channelData: any =  await updateData(channelId, editingData);
      //if the username is not in use
    return channelData;
  } catch (e: any) {
    logg.warn(e.message);
    return {
      success: false,
      code: 404,
      error: e.message,
    };
  }
};

//function to delete a channel
export const delete_Channel = async (channelId: string, userId: string): Promise<ResultTypes> => {
  try {
    const data = await Channel.findOneAndDelete({ _id: channelId, userRef: userId });
    if (!data) {
      //if channel doesnt exist
      return {
        success: false,
        code: 403,
        error: `channel doesn't exist`,
        data: null,
      };
    }
    //<--delete all videos on that channel -->
    const videoData = await Video.find({ channelId }, "_id");
    const promiseAllArray = [];
    for (let data in videoData) {
      promiseAllArray.push(Video.findOneAndDelete({ _id: videoData[data]._id }));
    }
    //<---------------------------->

    //<-- delete all comments from that channel -->
    const commentData = await Comment.find({ channelId }, "_id");
    const promiseAllArray2 = [];
    for (let data in commentData) {
      promiseAllArray2.push(Comment.findOneAndDelete({ _id: commentData[data]._id }));
    }
    //<---------------------------->

    //<-- remove channel id from subscription list of all users -->
    const removeAllSubbed = User.updateMany(
      { $pull: { Subscription: [channelId] } },
      { multi: true }
  );
    //<---------------------------->    


    //delete both video data and comment
    await Promise.allSettled([...promiseAllArray, ...promiseAllArray2, removeAllSubbed]);

    /*
     delete all replies on that channel 
     this is done last because comments will delete replies, likes and replies likes attached to it,

     so to prevent deleting twice, this is done after the first process
     */
    const replyData = await Reply.find({ channelId }, "_id");
    const ReplyArray = [];
    for (let data in replyData) {
      ReplyArray.push(Reply.findOneAndDelete({ _id: replyData[data]._id }));
    }
    await Promise.allSettled([...ReplyArray]);
    return {
      success: true,
      code: 200,
      message: `channel deleted successfuly`,
      data: '',
    };
  } catch (e: any) {
    logg.fatal(e.message);
    return {
      success: false,
      code: 404,
      error: e.message,
      data: null,
    };
  }
};

//function to fetch channel Likes
export const get_Channel_Likes = async (channelId: string): Promise<ResultTypes> => {
  try {
    const likes_count = await Video.aggregate([
      { $match: { channelId: new ObjectId(channelId) } },
      { $group: { _id: null, likes: { $sum: "$likes" } } },
    ]); //get total likes

    if (likes_count.length > 0) {
      const { likes } = likes_count[0];
      return {
        success: true,
        code: 200,
        data: { likes },
      };
    }
    //if there was no data for subsribers, meaning there was no channel at all
    return {
      success: false,
      code: 404,
      error: `No channel found`,
      data: "",
    };
  } catch (e: any) {
    logg.fatal(e.message);
    return {
      success: false,
      code: 404,
      error: e.message,
      data: "",
    };
  }
};

//function to get channel data
export const get_Channel_Dislikes = async (channelId: string): Promise<ResultTypes> => {
  try {
    const dislikes_count = await Video.aggregate([
      { $match: { channelId: new ObjectId(channelId) } },
      { $group: { _id: null, dislikes: { $sum: "$dislikes" } } },
    ]); //get total likes

    if (dislikes_count.length > 0) {
      const { dislikes } = dislikes_count[0];
      return {
        success: true,
        code: 200,
        data: { dislikes },
      };
    }
    //if there was no data for subsribers, meaning there was no channel at all
    return {
      success: false,
      code: 404,
      error: `No channel found`,
      data: "",
    };
  } catch (e: any) {
    logg.fatal(e.message);
    return {
      success: false,
      code: 404,
      error: e.message,
      data: "",
    };
  }
};

//function to get channel data
export const get_Channel_Views = async (channelId: string): Promise<ResultTypes> => {
  try {
    const views_count = await Video.aggregate([
      { $match: { channelId: new ObjectId(channelId) } },
      { $group: { _id: null, views: { $sum: "$Views" } } },
    ]); //get total views

    if (views_count.length > 0) {
      const { views } = views_count[0];
      const data = { views };
      return {
        success: true,
        code: 200,
        data,
      };
    }
    //if there was no data for subsribers, meaning there was no channel at all
    return {
      success: false,
      code: 404,
      error: `No channel found`,
      data: "",
    };
  } catch (e: any) {
    logg.fatal(e.message);
    return {
      success: false,
      code: 404,
      error: e.message,
      data: "",
    };
  }
};

//function to get subscribers amount
export const get_Channel_Subscribers = async (channelId: string): Promise<ResultTypes> => {
  try {
    const Subscribers = await Channel.findById(channelId, "Subscribers"); //get amount of subscribers
    if (Subscribers) {
      //if the channel is in the db
      return { success: true, code: 200, data: Subscribers };
    }
    //if there is no channel
    return { success: false, data: "", code: 404, error: "No channel found" };
  } catch (e: any) {
    logg.fatal(e.message);
    return { success: false, code: 404, error: "Something went wrong , try again later" };
  }
};

//function to get channel main data like name and all
export const get_ChannelData = async (channelId: string): Promise<ResultTypes> => {
  try {
    let channelData = await Channel.findOne({ _id: channelId });
    if (channelData) {
      //if the channel is in the db
      return { success: true, code: 200, data: channelData };
    }
    //if there is no channel
    return { success: false, data: "", code: 404, error: "No channel found" };
  } catch (e: any) {
    logg.fatal(e.message);
    return { success: false, code: 404, error: "Something went wrong , try again later" };
  }
};

//function to get channel ids from the user id
export const get_Channel_ids = async (userRef: string): Promise<ResultTypes> => {
  try {
    const channelData = await Channel.find({ userRef }, '_id');
    if (channelData) {
      //if the channel id in the db
      return { success: true, code: 200, data: channelData };
    }
    //if there is no channel
    return { success: false, data: "", code: 404, error: "No channel found" };
  } catch (e: any) {
    logg.fatal(e.message);
    return { success: false, code: 404, error: "Something went wrong , try again later" };
  }
};
interface editTypes {
  channelName?: string;
  username?: string;
  channelBanner?: string;
  channelPic?: string;
}

const updateData = async (channelId: string, editingData: editTypes): Promise<ResultTypes> => {
  const channelData = await Channel.findOneAndUpdate({ _id: channelId }, editingData, { new: true });
  if (channelData) {
    //if a document was changed
    return {
      success: true,
      code: 200,
      data:channelData,
    };
  }
  //if no document was changed
  return {
    success: false,
    code: 404,
    error: `channel wasn't found`,
    data: null,
  };
};

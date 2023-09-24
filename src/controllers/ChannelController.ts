import { Request, Response } from "express";
import {
  add_NewChannel,
  delete_Channel,
  edit_ChannelInfo,
  get_ChannelData,
  get_Channel_Dislikes,
  get_Channel_Likes,
  get_Channel_Subscribers,
  get_Channel_Views,
  get_Channel_ids
} from "../services/Channel";
import { EditChannelInfoTypes } from "../types/main";

//add a new channel

export const create_Channel = async (req: Request, res: Response) => {
  const { userId, channelName }: { userId: string; channelName: string } = req.body;

  if (userId && channelName) {
    try {
      const { success, message, data, error, code } = await add_NewChannel(userId, channelName);
      if (success) {
        //if everything went well
        return res.status(code).json({ status: code, message, data });
      }
      // if things went wrong
      return res.status(code).json({ status: code, error, data });
    } catch (e: any) {
      return res.status(404).json({ status: 404, error: "Something went wrong" });
    }
  }
  //if thingds went wrong
  return res.status(404).json({
    status: 404,
    error: `Provide the proper value for the following: (${userId ? "" : "userId,"} ${channelName ? "" : "channelName"})`,
  });
};

//edit channel data
export const edit_ChannelData = async (req: Request, res: Response) => {
  const { channelName, channelPic, channelBanner, username, channelId }: EditChannelInfoTypes = req.body;
  const EDITING_CONDITION = channelPic || channelBanner || channelName;
  if (channelId && EDITING_CONDITION) {
    try {
      const { success, code, message, error, data } = await edit_ChannelInfo({
        channelName,
        channelPic,
        channelBanner,
        username,
        channelId,
      });
      if (success) {
        //if everything went well
        return res.status(code).json({ status: code, message, data });
      }
      // if things went wrong
      return res.status(code).json({ status: code, error, data });
    } catch (e: any) {
      return res.status(404).json({ status: 404, error: "Something went wrong" });
    }
  }
  //if needed data was not provided
  return res.status(404).json({
    status: 404,
    error: `Provide the proper value for the property: (${channelId ? "" : "channelId,"} ${
      EDITING_CONDITION ? "" : `one channel value to change`
    })`,
  });
};

//delete channel
export const deleteChannel = async (req: Request, res: Response) => {
  const { channelId, userId }: { channelId: string; userId: string } = req.body;
  if (userId && channelId) {
    try {
      const { success, code, message, data, error } = await delete_Channel(channelId, userId);
      if (success) {
        //if everything went well
        return res.status(code).json({ status: code, message, data });
      }
      // if things went wrong
      return res.status(code).json({ status: code, error, data });
    } catch (e: any) {
      return res.status(404).json({ status: 404, error: "Something went wrong" });
    }
  }
  return res.status(404).json({
    status: 404,
    error: `Provide the proper value for the following: (${userId ? "" : "userId,"} ${channelId ? "" : "channelId"})`,
  });
};

//get channel Likes
export const Channel_Likes = async (req: Request, res: Response) => {
  const channelId: string = req.params.channelId;
  if (!channelId) {
    //if things went wrong
    return res.status(404).json({
      status: 404,
      error: `Provide the proper value for channelId`,
    });
  }
  try {
    const { success, code, message, data, error } = await get_Channel_Likes(channelId);
    if (success) {
      //if everything went well
      return res.status(code).json({ status: code, message, data });
    }
    // if things went wrong
    return res.status(code).json({ status: code, error, data });
  } catch (e: any) {
    return res.status(404).json({ status: 404, error: "Something went wrong" });
  }
};

//get channel Dislikes
export const Channel_Dislikes = async (req: Request, res: Response) => {
  const channelId: string = req.params.channelId;
  if (!channelId) {
    //if things went wrong
    return res.status(404).json({
      status: 404,
      error: `Provide the proper value for channelId`,
    });
  }
  try {
    const { success, code, message, data, error } = await get_Channel_Dislikes(channelId);
    if (success) {
      //if everything went well
      return res.status(code).json({ status: code, message, data });
    }
    // if things went wrong
    return res.status(code).json({ status: code, error, data });
  } catch (e: any) {
    return res.status(404).json({ status: 404, error: "Something went wrong" });
  }
};

//get channel Views
export const Channel_Views = async (req: Request, res: Response) => {
  const channelId: string = req.params.channelId;
  if (!channelId) {
    //if things went wrong
    return res.status(404).json({
      status: 404,
      error: `Provide the proper value for channelId`,
    });
  }
  try {
    const { success, code, message, data, error } = await get_Channel_Views(channelId);
    if (success) {
      //if everything went well
      return res.status(code).json({ status: code, message, data });
    }
    // if things went wrong
    return res.status(code).json({ status: code, error, data });
  } catch (e: any) {
    return res.status(404).json({ status: 404, error: "Something went wrong" });
  }
};

//get channel Subscribers
export const Channel_Subscribers = async (req: Request, res: Response) => {
  const channelId: string = req.params.channelId;
  if (!channelId) {
    //if things went wrong
    return res.status(404).json({
      status: 404,
      error: `Provide the proper value for channelId`,
    });
  }
  try {
    const { success, code, message, data, error } = await get_Channel_Subscribers(channelId);
    if (success) {
      //if everything went well
      return res.status(code).json({ status: code, message, data });
    }
    // if things went wrong
    return res.status(code).json({ status: code, error, data });
  } catch (e: any) {
    return res.status(404).json({ status: 404, error: "Something went wrong" });
  }
};

//get channel data
export const Channel_Data = async (req: Request, res: Response) => {
  const channelId: string = req.params.channelId;
  if (!channelId) {
    //if things went wrong
    return res.status(404).json({
      status: 404,
      error: `Provide the proper value for channelId`,
    });
  }
  try {
    const { success, code, message, data, error } = await get_ChannelData(channelId);
    if (success) {
      //if everything went well
      return res.status(code).json({ status: code, message, data });
    }
    // if things went wrong
    return res.status(code).json({ status: code, error, data });
  } catch (e: any) {
    return res.status(404).json({ status: 404, error: "Something went wrong" });
  }
};

//get channel ids from user id
export const Channel_Ids = async (req: Request, res: Response) => {
  const userRef: string = req.params.userRef;
  if (!userRef) {
    //if things went wrong
    return res.status(404).json({
      status: 404,
      error: `Provide the proper value for userRef`,
    });
  }
  try {
    const { success, code, message, data, error } = await get_Channel_ids(userRef);
    if (success) {
      //if everything went well
      return res.status(code).json({ status: code, message, data });
    }
    // if things went wrong
    return res.status(code).json({ status: code, error, data });
  } catch (e: any) {
    return res.status(404).json({ status: 404, error: "Something went wrong" });
  }
};

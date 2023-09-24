import { Request, Response } from "express";
import {
  get_All_Videos,
  get_One_Video,
  add_One_Video,
  edit_One_Video,
  delete_One_Video,
  publishing_One_Video,
  likes_for_One_Video,
  editScenes,
  get_Scenes,
  allActivity_for_One_Video,
  views_for_One_Video,
  dislikes_for_One_Video,
  delete_One_SceneVideo,
  delete_Scene,
} from "../services/Creation";
// <-- video -->

import { generateUploadURL } from "../services/s3Controls";
//get all videos made
export const get_AllVideos = async (req: Request, res: Response) => {
  const { channelId }: { channelId: string } = req.body;

  if (channelId) {
    try {
      const { success, message, data, error, code } = await get_All_Videos(channelId);
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
    error: `Provide the proper value for the following: (${channelId ? "" : "channelId"})`,
  });
};

//get one video
export const get_OneVideo = async (req: Request, res: Response) => {
  const channelId: string = req.body.channelId,
    videoId: string = req.params.videoId;

  if (channelId && videoId) {
    try {
      const { success, data, error, code } = await get_One_Video(channelId, videoId);
      if (success) {
        //if everything went well
        return res.status(code).json({ status: code, data });
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
    error: `Provide the proper value for the following: (${channelId ? "" : "channelId,"} ${videoId ? "" : ":videoId"})`,
  });
};

//create one new video
export const create_OneVideo = async (req: Request, res: Response) => {
  const { channelId, title }: { channelId: string; title: string } = req.body;

  if (channelId && title) {
    try {
      const { success, message, data, error, code } = await add_One_Video(channelId, title);
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
    error: `Provide the proper value for the following: (${channelId ? "" : "channelId,"} ${title ? "title" : "title"})`,
  });
};

// edit one video
export const edit_OneVideo = async (req: Request, res: Response) => {
  const {
    channelId,
    title,
    coverPhoto,
    description,
  }: {
    channelId: string;
    title: string;
    coverPhoto: string;
    description: string;
  } = req.body;
  const videoId: string = req.params.videoId;

  if (videoId && channelId && (title || coverPhoto || description)) {
    try {
      const { success, message, data, error, code } = await edit_One_Video({
        videoId,
        channelId,
        title,
        coverPhoto,
        description,
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
  //if thingds went wrong
  return res.status(404).json({
    status: 404,
    error: `Provide the proper value for the following: (${channelId ? "" : "channelId,"} ${videoId ? "" : "videoId,"} ${
      title || coverPhoto || description ? "" : `(title or coverPhoto or description)`
    })`,
  });
};

// publish/ unpublish one video
export const publishing_OneVideo = async (req: Request, res: Response) => {
  const { channelId, publishing }: { channelId: string; publishing: boolean } = req.body, //for req body
    videoId: string = req.params.videoId; // for params

  const PUBLISHING_CHECK = typeof publishing === "boolean";
  if (channelId && videoId && PUBLISHING_CHECK) {
    try {
      const { success, data, error, code, message } = await publishing_One_Video(videoId, channelId, publishing);
      if (success) {
        //if everything went well
        return res.status(code).json({ status: code, data, message });
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
    error: `Provide the proper value for the following: (${channelId ? "" : "channelId,"} ${videoId ? "" : "videoId"} ${
      PUBLISHING_CHECK ? "" : "publishing"
    })`,
  });
};

// delete one video
export const delete_OneVideo = async (req: Request, res: Response) => {
  const channelId: string = req.body.channelId,
    videoId: string = req.params.videoId;

  if (channelId && videoId) {
    try {
      const { success, data, error, code, message } = await delete_One_Video(channelId, videoId);
      if (success) {
        //if everything went well
        return res.status(code).json({ status: code, data, message });
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
    error: `Provide the proper value for the following: (${channelId ? "" : "channelId,"} ${videoId ? "" : "videoId"})`,
  });
};

// likes one video
export const likes_for_OneVideo = async (req: Request, res: Response) => {
  const channelId: string = req.body.channelId,
    videoId: string = req.params.videoId;

  if (channelId && videoId) {
    try {
      const { success, message, data, error, code } = await likes_for_One_Video(channelId, videoId);
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
    error: `Provide the proper value for the following: (${channelId ? "" : "channelId,"} ${videoId ? "" : "videoId"})`,
  });
};

// dislikes one video
export const dislikes_for_OneVideo = async (req: Request, res: Response) => {
  const channelId: string = req.body.channelId,
    videoId: string = req.params.videoId;

  if (channelId && videoId) {
    try {
      const { success, message, data, error, code } = await dislikes_for_One_Video(channelId, videoId);
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
    error: `Provide the proper value for the following: (${channelId ? "" : "channelId,"} ${videoId ? "" : "videoId"})`,
  });
};

// views for one video
export const views_for_OneVideo = async (req: Request, res: Response) => {
  const channelId: string = req.body.channelId,
    videoId: string = req.params.videoId;

  if (channelId && videoId) {
    try {
      const { success, message, data, error, code } = await views_for_One_Video(channelId, videoId);
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
    error: `Provide the proper value for the following: (${channelId ? "" : "channelId,"} ${videoId ? "" : "videoId"})`,
  });
};

// allActivity for one video
export const allActivity_for_OneVideo = async (req: Request, res: Response) => {
  const channelId: string = req.body.channelId,
    videoId: string = req.params.videoId;

  if (channelId && videoId) {
    try {
      const { success, message, data, error, code } = await allActivity_for_One_Video(channelId, videoId);
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
    error: `Provide the proper value for the following: (${channelId ? "" : "channelId,"} ${videoId ? "" : "videoId"})`,
  });
};

// <-- scenes -->

//get scenes made in one video

export const getScenes = async (req: Request, res: Response) => {
  const channelId: string = req.body.channelId,
    videoId: string = req.params.videoId;

  if (channelId && videoId) {
    try {
      const { success, message, data, error, code } = await get_Scenes(channelId, videoId);
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
    error: `Provide the proper value for the following: (${channelId ? "" : "channelId,"} ${videoId ? "" : "videoId"})`,
  });
};

// edit scene/s
export const edit_Scenes = async (req: Request, res: Response) => {
  const { channelId, newScenes }: { channelId: string; newScenes: [] } = req.body,
    videoId: string = req.params.videoId;

  if (channelId && videoId) {
    try {
      const { success, message, data, error, code } = await editScenes(channelId, videoId, newScenes);
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
    error: `Provide the proper value for the following: (${channelId ? "" : "channelId,"} ${videoId ? "" : "videoId"})`,
  });
};

export const deleteOneVideo = async (req: Request, res: Response) => {
  const { channelId, sceneId }: { channelId: string; sceneId: string } = req.body,
    videoId: string = req.params.videoId;

  if (channelId && videoId && sceneId) {
    try {
      const { success, data, error, code } = await delete_One_SceneVideo(videoId, sceneId, channelId);
      if (success) {
        //if everything went well
        return res.status(code).json({ status: code, data });
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
    error: `Provide the proper value for the following: (${channelId ? "" : "channelId,"} ${videoId ? "" : "videoId"}) ${
      sceneId ? "" : "sceneId"
    }`,
  });
};

export const deleteOneScene = async (req: Request, res: Response) => {
  const { channelId, sceneId }: { channelId: string; sceneId: string } = req.body,
    videoId: string = req.params.videoId;

  if (channelId && videoId && sceneId) {
    try {
      const { success, data, error, code } = await delete_Scene(videoId, sceneId, channelId);
      if (success) {
        //if everything went well
        return res.status(code).json({ status: code, data });
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
    error: `Provide the proper value for the following: (${channelId ? "" : "channelId,"} ${videoId ? "" : "videoId"}) ${
      sceneId ? "" : "sceneId"
    }`,
  });
};

export const getUploadurl = async (req: Request, res: Response) => {
  try {
    const url = await generateUploadURL();
    res.status(200).send({ url });
  } catch (e: any) {
    return res.status(404).send("something went wrong");
  }
};

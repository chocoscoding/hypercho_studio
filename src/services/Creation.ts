import logg from "../Logs/Customlog";
import { Video } from "../models";
import { ResultTypes } from "../types/main";
import { trimScenes } from "../utils";
import { deleteForBucket_1 } from "./s3Controls";
import { sign } from "crypto";
import dotenv from "dotenv";
import { custom } from "./custom";
dotenv.config();

//function to get all videos
export const get_All_Videos = async (channelId: string): Promise<ResultTypes> => {
  try {
    //findone
    const videoData = await Video.find({ channelId }, "title coverPhoto published");
    if (videoData) {
      //if the video data is there
      return { success: true, code: 200, data: videoData };
    }
    //if there is no channel
    return { success: false, data: "", code: 404, error: "No Video found" };
  } catch (e: any) {
    logg.fatal(e.message);
    return { success: false, code: 404, error: "Something went wrong , try again later" };
  }
};
//function to get one video
export const get_One_Video = async (channelId: string, videoId: string) => {
  try {
    //findone
    const videoData = await Video.findOne({ _id: videoId, channelId }, "-Scenes");
    if (videoData) {
      //if the video data is there
      return { success: true, code: 200, data: videoData };
    }
    //if there is no channel
    return { success: false, data: "", code: 404, error: "No Video found" };
  } catch (e: any) {
    logg.fatal(e.message);
    return { success: false, code: 404, error: "Something went wrong , try again later" };
  }
};

//function to add one new video
export const add_One_Video = async (channelId: string, title: string): Promise<ResultTypes> => {
  try {
    const newVideo = new Video({
      channelId,
      title,
      Scenes: [
        {
          name: "initial Scene",
          ArrangementNo: 1,
        },
      ],
    });
    const data = await newVideo.save(); // add a new video data
    return { success: true, code: 200, data };
  } catch (e: any) {
    logg.fatal(e.message);
    return { success: false, code: 404, error: e.message };
  }
};

//function to edit one video data
export const edit_One_Video = async ({
  videoId,
  channelId,
  title,
  coverPhoto,
  description,
}: {
  videoId: string;
  channelId: string;
  title: string;
  coverPhoto: string;
  description: string;
}): Promise<ResultTypes> => {
  const editingData = {
    ...(description && { description }),
    ...(title && { title }),
    ...(coverPhoto && { coverPhoto }),
  }; //data thats going to change
  try {
    const updateData = await Video.updateOne({ _id: videoId, channelId }, editingData); //update data with id and channelId, to prevent just any channel from editing just anything

    if (updateData) {
      //check if the data was changed
      return { success: true, code: 200, data: "", message: `info updated successfully` };
    }
    return { success: false, code: 404, data: "", error: "Your data didnt exist" };
  } catch (e: any) {
    logg.fatal(e.message);
    return { success: false, code: 404, data: "", error: e.message };
  }
};

//function to delete one video
export const delete_One_Video = async (channelId: string, videoId: string): Promise<ResultTypes> => {
  try {
    const deleteVideo = await Video.findOneAndDelete({ channelId, _id: videoId });

    if (deleteVideo) {
      //check if the data was changed
      return { success: true, code: 200, data: "", message: `Video deleted successfully` };
    }
    return { success: false, code: 404, data: "", error: "Video didn't exist" };
  } catch (e: any) {
    logg.fatal(e.message);
    return {
      success: false,
      code: 403,
      error: e.message,
      data: "",
    };
  }
};

//publish / unpublish one video
export const publishing_One_Video = async (videoId: string, channelId: string, publishing: boolean): Promise<ResultTypes> => {
  try {
    const ChangeData = await Video.findOne({ _id: videoId, channelId }, "published"); //first check if the data is there
    if (ChangeData === null) {
      //if the data doesnt exist
      return { success: false, code: 404, error: `Video doesn't exist` };
    } else {
      //if the new publishing data is not equal to the old
      if (ChangeData?.published !== publishing) {
        await Video.updateOne({ _id: videoId }, { published: publishing }); //update the new video publish status
        return { success: true, code: 200, message: `Video ${publishing ? "Published" : "Unpublished"} successfully`, data: "" };
      }
      //else the user doesn't need to perform that operation
      const errString = (publishing: boolean): string => (publishing ? "Video already published" : "Video already unpublished");
      return { success: false, data: "", code: 404, error: errString(publishing) };
    }
  } catch (e: any) {
    logg.fatal(e.message);
    return { success: false, code: 404, error: "Something went wrong here, try again later" };
  }
};

//get all likes for the video
export const likes_for_One_Video = async (channelId: string, videoId: string): Promise<ResultTypes> => {
  try {
    const data = await Video.findOne({ channelId, _id: videoId }, "likes"); //get total likes

    if (data) {
      return {
        success: true,
        code: 200,
        data,
      };
    }
    //if there was no data found
    return {
      success: false,
      code: 404,
      error: `No video found`,
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

//get all dislikes for the video
export const dislikes_for_One_Video = async (channelId: string, videoId: string): Promise<ResultTypes> => {
  try {
    const data = await Video.findOne({ channelId, _id: videoId }, "dislikes"); //get total dislikes

    if (data) {
      return {
        success: true,
        code: 200,
        data,
      };
    }
    //if there was no data found
    return {
      success: false,
      code: 404,
      error: `No video found`,
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

//get all views for the video
export const views_for_One_Video = async (channelId: string, videoId: string): Promise<ResultTypes> => {
  try {
    const data = await Video.findOne({ channelId, _id: videoId }, "Views"); //get total views

    if (data) {
      return {
        success: true,
        code: 200,
        data,
      };
    }
    //if there was no data found
    return {
      success: false,
      code: 404,
      error: `No video found`,
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

//get all views for the video
export const allActivity_for_One_Video = async (channelId: string, videoId: string): Promise<ResultTypes> => {
  try {
    const data = await Video.findOne({ channelId, _id: videoId }, "Views likes dislikes"); //get total views

    if (data) {
      return {
        success: true,
        code: 200,
        data,
      };
    }
    //if there was no data found
    return {
      success: false,
      code: 404,
      error: `No video found`,
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

//function to get all scenes in one video
export const get_Scenes = async (channelId: string, videoId: string): Promise<ResultTypes> => {
  try {
    const scenes = await Video.findOne({ _id: videoId, channelId }, "Scenes").lean(); //get all scenes
    if (scenes) {
      const AllScenes = scenes.Scenes;
      return {
        success: true,
        code: 200,
        data: AllScenes,
      };
    }
    //if there was no data found
    return {
      success: false,
      code: 404,
      error: `No video found`,
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

//function to edit one scene
export const editScenes = async (channelId: string, videoId: string, newScenes: []): Promise<ResultTypes> => {
  try {
    if (newScenes.length > 0) {
      //if scenes has a value
      const cleanedArray = trimScenes(newScenes);
      const INITIAL_EXIST: sceneTypes[] = cleanedArray.filter((x) => x.ArrangementNo === 1);
      const OTHERS = cleanedArray.filter((x) => x.ArrangementNo !== 1);
      if (INITIAL_EXIST.length > 0) {
        const editedInitial: sceneTypes = { ...INITIAL_EXIST[0], ArrangementNo: 1, name: "initial Scene" };
        const finalArr: Array<sceneTypes> = [...OTHERS, editedInitial];

        let promiseArr = [];
        for (let i = 0; i < finalArr.length; i++) {
          promiseArr.push(addToScenesArr(finalArr[i], videoId, channelId));
        }
        await Promise.allSettled(promiseArr);
        return {
          success: true,
          code: 200,
          data: "",
          message: `Scenes data changed`,
        };
      }

      let promiseArr: any[] = [];
      for (let i = 0; i < cleanedArray.length; i++) {
        promiseArr.push(addToScenesArr(cleanedArray[i], videoId, channelId));
      }
      await Promise.allSettled(promiseArr);
      return {
        success: true,
        code: 200,
        data: "",
        message: `Scenes data changed`,
      };
    }

    //if scene array is empty
    return {
      success: false,
      code: 404,
      error: `Scenes can't be empty`,
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

type sceneTypes = {
  _id?: string;
  videoId: string;
  title: string;
  name: string;
  Question: string;
  ArrangementNo: number;
  options: {
    _id?: string;
    Answer: string;
    SceneRef: string;
  }[];
};
//delete scene
export const delete_Scene = async (videoId: string, sceneId: string, channelId: string) => {
  try {
    const data: any = await Video.findOneAndUpdate({ channelId, _id: videoId }, { $pull: { Scenes: { _id: sceneId } } }, { Scenes: 1 });
    //if there was no data found after deleting, meaning nothing was deleted
    if (!data) {
      return {
        success: false,
        code: 404,
        error: `No video found`,
        data: "",
      };
    }
    const sceneArr: Array<sceneTypes> = data.Scenes;
    const findEle = sceneArr.filter((x) => x._id === sceneId);
    // if the scene was in the array of scenes, find the video id
    if (findEle[0]?.videoId) {
      await deleteForBucket_1([{ Key: videoId }]);
    }
    return {
      success: true,
      code: 200,
      error: `Scene deleted successfully`,
      data: "",
    };
  } catch (e: any) {
    logg.fatal(e.message);
    return {
      success: false,
      code: 404,
      error: "Something went wrong, check your req body before retrying",
      data: "",
    };
  }
};
//delete video
export const delete_One_SceneVideo = async (videoId: string, sceneId: string, channelId: string) => {
  try {
    const data: any = await Video.findOneAndUpdate(
      { channelId, _id: videoId, "Scenes._id": sceneId },
      {
        $set: { "Scenes.$.videoId": "" },
      },
      { Scenes: 1 }
    );

    //if there was no data found after deleting, meaning nothing was deleted
    if (!data) {
      return {
        success: false,
        code: 404,
        error: `No video found`,
        data: "",
      };
    }
    const sceneArr: Array<sceneTypes> = data.Scenes;
    const findEle = sceneArr.filter((x) => x._id === sceneId);
    // if the scene was in the array of scenes, find the video id
    if (findEle[0]?.videoId) {
      await deleteForBucket_1([{ Key: videoId }]);
    }
    return {
      success: true,
      code: 200,
      error: `video deleted successfully`,
      data: "",
    };
  } catch (e: any) {
    logg.fatal(e.message);
    return {
      success: false,
      code: 404,
      error: "Something went wrong, check your req body before retrying",
      data: "",
    };
  }
};

const addToScenesArr = async (SceneData: sceneTypes, videoId: string, channelId: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      //pull
      await Video.updateOne(
        { _id: videoId, channelId },
        {
          $pull: {
            Scenes: {
              _id: SceneData._id,
            },
          },
        }
      );
      //push
      await Video.updateOne({ _id: videoId }, { $push: { Scenes: SceneData } });
      resolve("Updated successfully");
    } catch (error: any) {
      logg.warn(error.message);
      reject("Something went wrong");
    }
  });
};

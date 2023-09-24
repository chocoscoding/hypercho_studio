import { model, Schema, ObjectId, Document } from "mongoose";
import { Comment, CommentLike, Like, Reply, View, ReplyLike, WatchLater } from ".";
import { deleteForBucket_1 } from "../services/s3Controls";
//types for video schema
export interface VideoType {
  _id?: ObjectId;
  title: string;
  coverPhoto: string;
  description: string;
  published: boolean;
  releaseDate: Date;
  likes: number;
  dislikes: number;
  Views: number;
  Genre: number;
  channelId: ObjectId;
  Scenes: {
    videoId: string;
    title: string;
    name: string;
    Question: string;
    ArrangementNo: number;
    options: {
      Answer: string;
      SceneRef: ObjectId;
    }[];
  }[];
}

//video schema
const videoSchema = new Schema<VideoType>({
  title: { type: String },
  coverPhoto: { type: String },
  description: { type: String, default: "Add a description" },
  published: { type: Boolean, default: false },
  releaseDate: { type: Date, default: Date.now },
  dislikes: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  Views: { type: Number, default: 0 },
  Genre: { type: Number, default: 1 },
  channelId: { ref: "channel", type: Schema.Types.ObjectId },
  Scenes: [
    {
      videoId: { type: String },
      title: {
        type: String,
        maxlength: 50,
      },
      name: {
        type: String,
        maxlength: 30,
      },
      Question: {
        type: String,
        maxlength: 65,
      },
      ArrangementNo: {
        type: Number,
        required: true,
      },
      options: [
        {
          Answer: { type: String },
          SceneRef: { type: Schema.Types.ObjectId },
        },
        { _id: false },
      ],
    },
  ],
});

videoSchema.post("findOneAndDelete", async (doc: VideoType, next: () => void) => {
  //if the document doesnt exist
  if (!doc) {
    return next();
  }
  const { _id: id, Scenes } = doc;

  const deleteAllComments = Comment.deleteMany({ videoRef: id }); //delete all comments for that video
  const deleteAllReplies = Reply.deleteMany({ videoRef: id }); //delete all replies for that video

  const deleteAllCommentLikes = CommentLike.deleteMany({ videoRef: id }); //delete all comment likes for that video
  const deleteAllReplieslikes = ReplyLike.deleteMany({ videoRef: id }); //delete all replies for that video
  const deleteAllHistories = View.deleteMany({ Ref: id }); //remove video data from peoples watch history
  const deleteAllLikes = Like.deleteMany({ Ref: id }); //remove all likes /dislikes attached to that video
  const deleteAllWatchLater = WatchLater.deleteMany({ Ref: id }); //

  const toBeDeleted = []; //array of values to be deleted
  for (let X in Scenes) {
    const videoId = Scenes[X].videoId;
    if (videoId) {
      toBeDeleted.push({ Key: videoId });
      //push all values to be deleted to array
    }
  }
  const deleteAllVideos = toBeDeleted.length > 0 ? deleteForBucket_1(toBeDeleted) : []; //if the there are no values to delete, dont run delete from bucket

  //< --delete video from cloudfront and aws-->
  await Promise.allSettled([
    deleteAllComments,
    deleteAllReplies,
    deleteAllCommentLikes,
    deleteAllReplieslikes,
    deleteAllHistories,
    deleteAllLikes,
    deleteAllVideos,
    deleteAllWatchLater,
  ]);
  return next();
});

export default model<VideoType>("video", videoSchema);

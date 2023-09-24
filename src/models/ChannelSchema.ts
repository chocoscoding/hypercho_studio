import { model, Schema, ObjectId, Document } from "mongoose";
import { CommentLike, Reply, ReplyLike } from ".";
import logg from "../Logs/Customlog";

//types for channel schema
interface ChannelSchemaType {
  channelName: string;
  channelPic: string;
  channelBanner: string;
  userRef: ObjectId;
  username: string;
  Subscribers: number;
  RegDate: Date;
}
//channel shema
const ChannelSchema = new Schema<ChannelSchemaType>({
  Subscribers: {
    type: Number,
    default: 0,
  },
  RegDate: {
    type: Date,
    default: Date.now,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  userRef: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  channelName: {
    type: String,
    required: true,
  },
  channelPic: {
    type: String,
    default: "",
  },
  channelBanner: {
    type: String,
    default: "",
  },
});

export default model<ChannelSchemaType>("channel", ChannelSchema);


ChannelSchema.post("findOneAndDelete", async (doc: ChannelSchemaType, next: () => void) => {
  //if the document doesnt exist
  if (!doc) {
    return next();
  }

  //if the document exists
  try {
    
  } catch (e: any) {
    logg.warn(e.message);
  }
  return next();
});
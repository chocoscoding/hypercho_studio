import { model, Schema, ObjectId, Document } from "mongoose";
//types for user management schema
interface userType {
  Watchlater: any[];
  Settings: {
    History: {
      Pause: Boolean;
    };
  };
  Subscription: any[];
  profilePic: string;
  username: string;
  channel: ObjectId;
  History:
    | {
        Ref: ObjectId;
        Date: Date;
        Scenes: { no: number; id: ObjectId }[];
      }[]
    | any[];
}
//user management schema
const user = new Schema<userType>({
  Watchlater: [
    {
      type: Schema.Types.ObjectId,
      ref: "video",
    },
  ],
  Settings: {
    type: Schema.Types.Mixed,
    History: {
      type: Schema.Types.Mixed,
      Pause: { type: Boolean, default: false },
    },
  },
  Subscription: [
    {
      type: Schema.Types.ObjectId,
      ref: "channel",
    },
  ],
  profilePic: { type: String },
  username: { type: String },
  channel: {
    type: Schema.Types.ObjectId,
    ref: "channel",
  },
  History: [
    {
      type: Schema.Types.Mixed,
      Ref: {
        type: Schema.Types.ObjectId,
        Ref: "video",
      },
      Date: {
        type: Schema.Types.Date,
        default: Date.now,
      },
      Scenes: [
        {
          type: Schema.Types.Mixed,
          no: { type: Number },
          id: { type: Schema.Types.ObjectId },
        },
      ],
      channel: {
        type: Schema.Types.ObjectId,
        Ref: "channel",
      },
    },
    { _id: false },
  ],
});
export default model<userType>("user", user);

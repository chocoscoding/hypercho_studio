import { model, ObjectId, Schema } from "mongoose";

interface watchLaterSchemaType {
  userId: ObjectId;
  Ref: ObjectId;
}

const watchLaterSchema = new Schema<watchLaterSchemaType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    Ref: {
      type: Schema.Types.ObjectId,
      Ref: "video",
      required: true,
    },
  },
  { timestamps: true }
);

const Watchlater = model<watchLaterSchemaType>("watchlater", watchLaterSchema);
export default Watchlater;

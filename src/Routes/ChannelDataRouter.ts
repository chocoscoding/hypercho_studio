import { Router } from "express";
import {
  Channel_Data,
  Channel_Ids,
  Channel_Dislikes,
  Channel_Likes,
  Channel_Subscribers,
  Channel_Views,
  create_Channel,
  deleteChannel,
  edit_ChannelData,
} from "../controllers/ChannelController";

const r = Router();

r.post("/create", create_Channel);
r.patch("/edit", edit_ChannelData);
r.delete("/delete", deleteChannel);
r.get("/:channelId/ChannelLikes", Channel_Likes);
r.get("/:channelId/ChannelDislikes", Channel_Dislikes);
r.get("/:channelId/ChannelViews", Channel_Views);
r.get("/:channelId/ChannelSubscribers", Channel_Subscribers);
r.get("/:channelId/ChannelData", Channel_Data);
r.get("/:userRef/Channels", Channel_Ids);
export default r;

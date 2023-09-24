import { Router } from "express";
import {
  create_OneVideo,
  delete_OneVideo,
  dislikes_for_OneVideo,
  edit_Scenes,
  edit_OneVideo,
  get_AllVideos,
  getScenes,
  get_OneVideo,
  likes_for_OneVideo,
  publishing_OneVideo,
  views_for_OneVideo,
  allActivity_for_OneVideo,
  deleteOneScene,
  deleteOneVideo,
  getUploadurl,
} from "../controllers/CreationController";

const r = Router();

// <-- video -->

r.post("/", get_AllVideos); // all videos
r.put("/", create_OneVideo); // create one video
r.get("/uploadUrl", getUploadurl); //get upload url
r.route("/:videoId").post(get_OneVideo).patch(edit_OneVideo).delete(delete_OneVideo); // one video
r.patch("/:videoId/publishing", publishing_OneVideo); // publish and unpublish one video
r.post("/:videoId/likes", likes_for_OneVideo); // likes for one video
r.post("/:videoId/dislikes", dislikes_for_OneVideo); // dislikes for one video
r.post("/:videoId/views", views_for_OneVideo); // views for one video
r.post("/:videoId/AllActivity", allActivity_for_OneVideo); // all activity for one video

// <-- scenes -->

r.route("/:videoId/Scenes").post(getScenes).patch(edit_Scenes).delete(deleteOneScene); //get all scenes
r.route("/:videoId/Scenes/video").delete(deleteOneVideo); //delete one scenes
export default r;

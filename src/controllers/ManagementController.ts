import { deleteOneComment, deleteOneReply } from "../services/Management";
import { Request, Response } from "express";
import logg from "../Logs/Customlog";
import { channel } from "diagnostics_channel";


//delete comment
export const DeleteComment = async (req: Request, res: Response) => {
    const { commentId, videoRef }: { commentId: string, videoRef: string } = req.body;
    if (commentId && videoRef) {
      try {
        const { success, code, error } = await deleteOneComment(commentId, videoRef);
        if (success) return res.status(code).json({ status: code, data: "", message: `comment deleted successfully` });
  
        //if things didnt go so well
        return res.status(code).json({ status: code, data: "", error });
      } catch (e) {
        //if Something went wrong
        logg.warn(`Error while adding deleting comment`);
        return res.status(404).json({ error: `something went wrong, try again` });
      }
    }
    //if the appropriate values were not provided
    return res.status(404).json({ error: "Provide the proper value for the following: (commentId, videoRef)" });
  };
  //delete reply
  export const DeleteReply = async (req: Request, res: Response) => {
    const { replyId, videoRef }: { replyId: string,videoRef: string } = req.body;
    if (replyId && videoRef) {
      try {
        const { success, code, error } = await deleteOneReply(replyId, videoRef);
        if (success) return res.status(code).json({ status: code, data: "", message: `Reply deleted successfully` });
  
        //if things didnt go so well
        return res.status(code).json({ status: code, data: "", error });
      } catch (e) {
        //if Something went wrong
        logg.warn(`Error while adding deleting reply`);
        return res.status(404).json({ error: `something went wrong, try again` });
      }
    }
    //if the appropriate values were not provided
    return res.status(404).json({ error: "Provide the proper value for the following: (replyId, videoRef)" });
  };
  
import { Comment, Reply } from "../models";
import { ResultTypes } from "../types/main";
import logg from "../Logs/Customlog";

//function to delete comment
export const deleteOneComment = async (commentId: string, videoRef: string): Promise<ResultTypes> => {
    try {
      //run a delete operation on the model of comment
      const deleteDoc = await Comment.findOneAndDelete({ _id: commentId, videoRef });
      
      if (deleteDoc) {
        //if everything went well
        return {
          success: true,
          code: 200,
        };
      }
      //if document didnt exist didnt go well
      return { success: false, code: 404, error: "This comment does not exist or you dont have permission to delete" };
    } catch (e: any) {
      logg.fatal(e.message);
      return { success: false, code: 404, error: e.message };
    }
  };
  
  //function to delete reply
  export const deleteOneReply = async (replyId: string, videoRef: string): Promise<ResultTypes> => {
    try {
      //run a delete operation on the model of Reply and remove the corresponding id from comments
      const deleteDoc = await Reply.findOneAndDelete({ _id: replyId, videoRef});
      
  
      if (deleteDoc) {
        //if everything went well
        return {
          success: true,
          code: 200,
        };
      }
      //if document didnt exist didnt go well
      return { success: false, code: 404, error: "This reply does not exist or you dont have permission to delete" };
    } catch (e: any) {
      logg.fatal(e.message);
      return { success: false, code: 404, error: e.message };
    }
  };
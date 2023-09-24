import { Router } from "express";
import { DeleteComment, DeleteReply } from "../controllers/ManagementController";

const r = Router();

r.delete('/comment', DeleteComment) // get or delete 
r.delete('/replyId', DeleteReply) // get or delete 

export default r;

import { S3Client,DeleteObjectsCommand } from '@aws-sdk/client-s3';
import {S3} from 'aws-sdk';
import dotenv from 'dotenv'
import logg from '../Logs/Customlog';
import crypto from 'crypto'
import { promisify } from "util"
const randomBytes = promisify(crypto.randomBytes)

dotenv.config()

const BUCKET_1_NAME = process.env.BUCKET_NAME_1;
const BUCKET_1_REGION = process.env.BUCKET_LOCATION_1;
const ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const s3_1 = new S3Client({
    credentials: {
        accessKeyId: ACCESS_KEY!,
        secretAccessKey: SECRET_ACCESS_KEY!
    },
    region: BUCKET_1_REGION
})
export const deleteForBucket_1 =async (mediaKey:{Key:string}[])=>{
    try{
const params = {
    Bucket: BUCKET_1_NAME!,
    Delete: {Objects: mediaKey}
}

const command = new DeleteObjectsCommand(params)
 await s3_1.send(command)
return { success: true}
}catch(e:any){
    logg.fatal('error while deleting document from s3');
    console.log(e.message)
    return { success: false}
}
}



export const generateUploadURL = async ()=> {
    const s3 = new S3({
        accessKeyId: ACCESS_KEY!,
        secretAccessKey: SECRET_ACCESS_KEY!,
    region: BUCKET_1_REGION
    })
  const rawBytes = await randomBytes(16)
  const imageName = rawBytes.toString('hex')

  const params = ({
    Bucket: BUCKET_1_NAME!,
    Key: imageName,
    Expires: 60*60
  })
  
  const uploadURL = await s3.getSignedUrlPromise('putObject', params)
  return uploadURL
}
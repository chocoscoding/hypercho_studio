import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/Mongodb";
import logg from "./Logs/Customlog";
import { ChannelRoute, CreationRoute, ManagementRoute } from "./Routes";

dotenv.config();
const PORT: number | string = process.env.PORT || 9970;
const app: Express = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/Channel", ChannelRoute);
app.use("/Creation", CreationRoute);
app.use("/Management", ManagementRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Welcome to the studio service</h1>");
});



const start = async () => {
  const MONGO_URI: any = process.env.MONGO_URI;
  try {
    await connectDB(MONGO_URI);
    app.listen(PORT, () => logg.info(`Running on http://localhost:${PORT} ⚡`));
  } catch (error) {
    logg.fatal(error);
  }
};

start();

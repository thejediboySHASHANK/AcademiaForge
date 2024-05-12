import express, {NextFunction, Request, Response} from "express"
require("dotenv").config();
export const app = express();
// @ts-ignore
import cors from "cors";
// @ts-ignore
import cookieParser from "cookie-parser";
import {ErrorMiddleware} from "./middleware/error";

//Body Parser
app.use(express.json({limit: "50mb"}));

//Cookie parser
app.use(cookieParser());

//(Cross Origin Resource Sharing)
app.use(cors({
    origin: process.env.ORIGIN
}));

//testing route
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success:true,
        message: "API is functional"
    });
});

//unknown routes => gives err
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err);
});

app.use(ErrorMiddleware);
import {Request, Response, NextFunction} from 'express';
import ErrorHandler from "../utils/ErrorHandler";
import jwt, {JwtPayload} from "jsonwebtoken";
import {redis} from "../utils/redis";

// Authenticated user
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;

    if (!access_token) {
        return new ErrorHandler('Please Login first to access this resource', 401);
    }

    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload;

    if (!decoded) {
        return new ErrorHandler('Access Token is not valid', 400);
    }

    const user = await redis.get(decoded.id);

    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    req.user = JSON.parse(user);

    next();
};

// validate user role

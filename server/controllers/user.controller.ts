import path from "path";

require('dotenv').config()
import {Request, Response, NextFunction} from "express";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import {CatchAsyncError} from "../middleware/catchAsyncErrors";
import jwt, {Secret} from "jsonwebtoken"
import ejs from "ejs"

// Register User
interface IRegistration {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

interface IActivationToken {
    token: string;
    activationCode: string;

}

export const registrationUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {name, email, password} = req.body;

        // email verification
        const isEmailExist = await userModel.findOne({email});
        if (isEmailExist) {
            return next(new ErrorHandler("Email already exists", 400));
        }

        const user: IRegistration = {
            name, email, password
        };

        // Generating and configuring Activation Code
        const activationToken = createActivationToken(user);

        const activationCode = activationToken.activationCode;

        // Configuring Email for activation
        const data = {user: {name: user.name}, activationCode}
        const html = await ejs.renderFile(path.join(__dirname, "../mails/activation-mail.ejs"), data);

        // Sending Email
        try {

        } catch (error) {

        }

    } catch(error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

export const createActivationToken = (user: any): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = jwt.sign({
        user,
        activationCode
    }, process.env.ACTIVATION_SECRET as Secret, {
        expiresIn: "5m",
    });

    return {token, activationCode};
}

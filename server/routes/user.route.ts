import express from "express"
import {activateUser, registrationUser} from "../controllers/user.controller";
const useRouter = express.Router();

useRouter.post('/registration', registrationUser);

useRouter.post('/activate-user', activateUser);


export default useRouter;
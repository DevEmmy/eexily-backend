import Container from "typedi";
import { UserController } from "../controllers/UserController";
import Router, { Request, Response } from "express";
import { verifyAuth } from "../middleware/verifyAuth";
const router = Router();

const userController = Container.get(UserController);
router.post("/sign-in", (req: Request, res: Response) => userController.signIn(req, res))
router.post("/verify-user", (req: Request, res: Response) => userController.verifyOtp(req, res))
router.post("/resend-user", (req: Request, res: Response) => userController.resendOtp(req, res))
router.post("/sign-up", (req: Request, res: Response) => userController.signUp(req, res))
router.patch("/forgotten-password", (req: Request, res: Response) => userController.forgotPassword(req, res))
router.post("/update-password", (req: Request, res: Response) => userController.updatePassword(req, res))
router.post("/complete-registration", verifyAuth,(req: Request, res: Response) => userController.completeRegistration(req, res)) //add middleware


export default router;
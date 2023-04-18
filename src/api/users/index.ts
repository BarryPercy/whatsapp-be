import express, { Request } from "express";
import UserModel from "./model";
import { createAccessToken } from "../../lib/auth/tools";
import passport from "passport";

const userRouter = express.Router();

userRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req: any, res, next) => {
    try {
      res.redirect(
        `${process.env.FE_DEV_URL}?accessToken=${req.user.accessToken}`
      );
    } catch (error) {
      next(error);
    }
  }
);

userRouter.post("/account", async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await UserModel.findOne({ email });
  if (userExists) {
    return res.status(422).json("Email already exists");
  }
  const user = new UserModel({ name, email, password });
  await user.save();
  const token = await createAccessToken({
    _id: user._id.toString(),
    role: "User",
  });
  res.json({ user, token });
});

userRouter.post("/session", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email, password });
  if (!user) {
    return next({ status: 422, message: "Email or password is incorrect" });
  }

  const token = await createAccessToken({
    _id: user._id.toString(),
    role: "User",
  });
  res.json({ user, token });
});

export default userRouter;

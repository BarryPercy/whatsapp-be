import express, { Request } from "express";
import multer from "multer";
import UserModel from "./model";
import { createAccessToken } from "../../lib/auth/tools";
import passport from "passport";
import createHttpError from "http-errors";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { JWTAuthMiddleware } from "../../lib/auth/jwt";
import { TokenPayload } from "../../lib/auth/tools";

interface CustomRequest extends Request {
  user?: TokenPayload;
}
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


userRouter.get("/", async (req, res, next) => {
  try {
    const user = await UserModel.find();
    res.send(user);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UserModel.findById((req as CustomRequest).user!._id);
    if (user) {
      res.send(user);
    } else {
      res.send(
        createHttpError(404, "Couldn't find user")
      );
    }
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:id", async (req, res, next) => {
  try {
    const users = await UserModel.findById(req.params.id);
    if (users) {
      res.send(users);
    } else {
      next(createHttpError(404, `User with id ${req.params.id} not found`));
    }
  } catch (error) {
    next(error);
  }
});

userRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate((req as CustomRequest).user!._id,
      req.body,
      { new: true, runValidators: true }
    );
    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
});

{
  const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "whatsapp/avatar",
    } as any,
  }),
}).single("avatar");
}

//userRouter.post("/me/avatar", cloudinaryUploader, async)

export default userRouter;

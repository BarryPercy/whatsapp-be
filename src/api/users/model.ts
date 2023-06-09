import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { Model, Document } from "mongoose";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  status?: string;
  role: "User" | "Admin";
  accessToken?: string;
}

interface UserModelInterface extends Model<UserDocument> {
  checkCredentials(
    email: string,
    plainPW: string
  ): Promise<UserDocument | null>;
}

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: {
      type: String,
      default: `https://www.maxpixel.net/static/photo/1x/Profile-Man-Symbol-Human-Communication-User-Home-42914.png `,
    },
    status: { type: String },
    role: { type: String, enum: ["User", "Admin"], default: "User" },
    accessToken: { type: String },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  const newUserData = this;
  if (newUserData.isModified("password")) {
    const plainPw = newUserData.password;
    const hash = await bcrypt.hash(plainPw, 16);
    newUserData.password = hash;
  }
});

UserSchema.methods.toJSON = function () {
  const currentUser = this.toObject();
  delete currentUser.password;
  delete currentUser.createdAt;
  delete currentUser.updatedAt;
  delete currentUser.__v;

  return currentUser;
};

UserSchema.static("checkCredentials", async function (email, plainPW) {
  const user = await this.findOne({ email });
  if (user) {
    const passwordMatch = await bcrypt.compare(plainPW, user.password);
    if (passwordMatch) {
      return user;
    } else {
      return null;
    }
  } else {
    return null;
  }
});
const UserModel: UserModelInterface = model<UserDocument, UserModelInterface>(
  "User",
  UserSchema
);

export default UserModel;

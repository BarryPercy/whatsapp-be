import { Schema, model } from "mongoose";


const UserSchema = new Schema({
    name: {type: String, required: true},
    email:{type: String, required: true},
    password: {type: String, required: true},
    avatar: {type: String, default: `<i class="bi bi-person-circle"></i>`},
    status: {type: String}
})

const UserModel = model("User", UserSchema)

export default UserModel
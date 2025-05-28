import { model, Schema } from "mongoose";
import { TUser } from "./user.interface";

const userSchema = new Schema<TUser>({
    id :{ 
        type: String, 
        required: true
    },
    password: {
        type: String,
        required: true
    },
    needsChangePassword: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ['admin', 'student', 'faculty'],
        required: true
    },
    status: {
        type: String,
        enum: ['in-progress', 'blocked'],
        default: 'in-progress'
    },
    isDeleted: {
        type : Boolean,
        default: false
    }
},
{
    timestamps: true,
})


const UserModel = model<TUser>('User', userSchema);
export default UserModel;
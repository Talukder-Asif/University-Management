import { model, Schema } from "mongoose";
import { TUser } from "./user.interface";
import config from "../../config";
import bcrypt from 'bcrypt';

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

userSchema.pre('save', async function (next) {
    const user = this;
    user.password = await bcrypt.hash(
        user.password,
        Number(config.salt_rounds)
    )
})

const UserModel = model<TUser>('User', userSchema);
export default UserModel;
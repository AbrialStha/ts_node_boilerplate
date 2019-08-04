/**
 * This is User Model
 */
import mongoose, { Schema, Document, model, Model } from "mongoose";
import { Roles } from '../enums'

export interface IUser extends Document {
    name: string
    email: string
    password: string
    avatar?: string
    role?: string
}

const UserSchema: mongoose.Schema<any> = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    role: {
        type: [String],
        default: [Roles.User]
    },
    created_date: {
        type: Date,
        required: true,
        default: Date.now
    }
});

let Users: Model<IUser, {}> = model(
    "Users",
    UserSchema
);

export default Users;
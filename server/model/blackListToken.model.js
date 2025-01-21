import mongoose from "mongoose";

const Schema = mongoose.Schema;

const BlacklistTokenSchema = new Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // Token will automatically be removed after 24 hours
    }
});

export const blacklistToken = mongoose.model("blacklistToken", BlacklistTokenSchema);
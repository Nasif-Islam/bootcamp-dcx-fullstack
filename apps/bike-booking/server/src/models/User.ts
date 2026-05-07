import mongoose, { Schema, Model, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: any) => {
        ret.id = ret._id.toString();
        if (ret.createdAt) {
          ret.createdAt = ret.createdAt.toISOString();
        }
        if (ret.updatedAt) {
          ret.updatedAt = ret.updatedAt.toISOString();
        }
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  },
);

userSchema.index({ email: 1 }, { unique: true });

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

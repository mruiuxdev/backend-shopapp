import mongoose from "mongoose";
import { UserDoc, UserModel } from "../../constants/auth";
import { AuthenticationService } from "../../services/auth.service";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const hashedPassword = new AuthenticationService().pwdToHash(
      this.get("password")
    );
    this.set("password", hashedPassword);
  }

  next();
});

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export default User;

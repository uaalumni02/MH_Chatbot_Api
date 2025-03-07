import mongoose from "mongoose";
const { Schema } = mongoose;

import * as validate from "../helpers/model/user";

const UserSchema = Schema({
  userName: {
    type: String,
    required: [true, "Please enter valid user name"],
    validate: [validate.isValidUserName, "Please enter valid user name"],
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  __v: {
    type: Number,
    select: false,
  },
});

UserSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("User", UserSchema);

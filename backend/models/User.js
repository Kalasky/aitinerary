const mongoose = require("mongoose");
import { object, string, boolean } from "yup";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  whiteListed: { type: Boolean, default: false },
  savedTrips: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trip" }],
});

const UserValidationSchema = object({
  email: string().email().required("Email is required"),
  whiteListed: boolean(),
  savedTrips: array().of(string()),
});

UserSchema.methods.validate = function (data) {
  return UserValidationSchema.validate(data);
};

export default mongoose.model("User", UserSchema);
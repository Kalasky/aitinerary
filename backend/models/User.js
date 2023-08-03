import { object, string, boolean } from "yup";

const UserValidationSchema = object({
  email: string().email().required("Email is required"),
  whiteListed: boolean(),
  savedTrips: array().of(string()),
});

UserSchema.methods.validate = function (data) {
  return UserValidationSchema.validate(data);
};

module.exports = validateUser;
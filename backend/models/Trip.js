import mongoose from "mongoose";
import { object, string } from "yup";

const TripSchema = new mongoose.Schema({
  destination: { type: String, required: true },
  duration: { type: String, required: true },
  numberOfPeople: { type: String, required: true },
  budget: { type: String, required: true },
  landscapes: [{ type: String }],
  theme: { type: String },
  itinerary: [
    {
      day: { type: Number },
      activities: { type: String },
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const TripValidationSchema = object().shape({
  destination: string().required("Destination is required"),
  duration: string().required("Duration is required"),
  numberOfPeople: string().required("Number of people is required"),
  budget: string().required("Budget is required"),
  landscapes: array().of(string()),
  theme: string(),
  itinerary: array().of(
    object({
      day: number(),
      activities: string(),
    })
  ),
  user: string(),
});

TripSchema.methods.validate = function (data) {
  return TripValidationSchema.validate(data);
};

export default mongoose.model("Trip", TripSchema);

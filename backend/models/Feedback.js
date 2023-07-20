const mongoose = require("mongoose");
const { object, string, number } = require("yup");

const FeedbackSchema = new mongoose.Schema({
  otherProposals: { type: Number, default: 0 },
  budgetNotRespected: { type: Number, default: 0 },
  themeNotRespected: { type: Number, default: 0 },
  customFeedback: { type: String, default: "" },
  email: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const FeedbackValidationSchema = object({
  otherProposals: number(),
  budgetNotRespected: number(),
  themeNotRespected: number(),
  customFeedback: string().min(20),
  email: string().email("Invalid email"),
  user: string(),
});

FeedbackSchema.methods.validate = function (data) {
  return FeedbackValidationSchema.validate(data);
};

module.exports = mongoose.model("Feedback", FeedbackSchema);

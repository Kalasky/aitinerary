const { object, string, number } = require("yup");

const FeedbackValidationSchema = object().shape({
  otherProposals: number().default(0),
  budgetNotRespected: number().default(0),
  themeNotRespected: number().default(0),
  customFeedback: string().default(""),
  email: string().email("Invalid email"),
  user: string(),
});

async function validateFeedback(data) {
  return await FeedbackValidationSchema.validate(data);
}

module.exports = validateFeedback;

import validator from "validator";
import isEmpty from "./is-empty";

const answerInputValidator = (data: { description: string }) => {
  const errors: { answerSize?: string } = {};
  if ((validator.isLength(data.description), { min: 20, max: 5000 })) {
    errors.answerSize = "Answer must be between 20 and 5000 characters";
  }
  return { errors, isValid: isEmpty(errors) };
};

export default answerInputValidator;

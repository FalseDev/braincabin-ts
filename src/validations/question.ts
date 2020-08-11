import validator from "validator";
import isEmpty from "./is-empty";

const questionInputValidator = (data: {
  level?: string;
  subject?: string;
  title?: string;
  description?: string;
}) => {
  const errors: {
    title?: string;
    description?: string;
    subject?: string;
    level?: string;
  } = {};

  data.level = isEmpty(data.level) ? "" : data.level;
  data.subject = isEmpty(data.subject) ? "" : data.subject;
  data.title = isEmpty(data.title) ? "" : data.title;
  data.description = isEmpty(data.description) ? "" : data.description;

  if (!validator.isLength(data.title!, { min: 10, max: 30 }))
    errors.title = "Title must be between 10 and 30 charcaters";

  if (!validator.isLength(data.description!, { min: 20, max: 1500 }))
    errors.description = "Descriptionm must be between 20 and 1500 characters";

  const subjects = [
    "mathematics",
    "social",
    "science",
    "english",
    "physics",
    "biology",
    "chemistry",
  ];
  if (!subjects.find((sub) => sub === data.subject)) {
    errors.subject = "Invalid subject";
  }

  const levels = [
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "undergraduate",
    "graduate",
    "phd",
  ];
  if (!levels.find((lev) => lev === data.level)) {
    errors.level = "Invalid level";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export default questionInputValidator;

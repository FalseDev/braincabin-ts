import validator from "validator";

import isEmpty from "./is-empty";

export default (data: {
  status?: string;
  institute?: string;
  birthdate?: string;
}) => {
  const errors: {
    status?: string;
    institute?: string;
    birthdate?: string;
  } = {};

  data.status = isEmpty(data.status) ? "" : data.status;
  data.institute = isEmpty(data.institute) ? "" : data.institute;

  if (validator.isEmpty(data.status!))
    errors.status = "Please choose your current status";

  if (!validator.isLength(data.institute!, { min: 5, max: 50 }))
    errors.institute = "Value must be between 5 and 50 characters";
  if (validator.isEmpty(data.institute!))
    errors.institute = "Please fillout this field";

  if (isEmpty(data.birthdate)) errors.birthdate = "Birthdate is required";

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

import Validator from "validator";
import isEmpty from "./is-empty";
export default function validateRegisterInput(data: {
  name: string;
  username: string;
  password: string;
  passwordconfirm: string;
  email: string;
}) {
  let errors: {
    username?: string;
    name?: string;
    email?: string;
    password?: string;
    passwordconfirm?: string;
  } = {};

  data.name = isEmpty(data.name) ? "" : data.name;
  data.username = isEmpty(data.username) ? "" : data.username;
  data.email = isEmpty(data.email) ? "" : data.email;
  data.password = isEmpty(data.password) ? "" : data.password;
  data.passwordconfirm = isEmpty(data.passwordconfirm)
    ? ""
    : data.passwordconfirm;

  // Username validation
  if (!Validator.isLength(data.username, { min: 6, max: 30 }))
    errors.username = "Username must be between 6 and 30 character of length";
  if (Validator.isEmpty(data.username))
    errors.username = "Username is required";

  // Name validation
  if (!Validator.isLength(data.name, { min: 2, max: 30 }))
    errors.name = "Name must be between 2 and 30 characters of length";
  if (Validator.isEmpty(data.name)) errors.name = "Name is required";

  // Email validation
  if (!Validator.isEmail(data.email))
    errors.email = "Please enter a valid email addresse";
  if (Validator.isEmpty(data.email)) errors.email = "Email is required";

  // Password validation
  if (!Validator.isLength(data.password, { min: 8, max: 30 }))
    errors.password = "Password must be between 8 and 30 characters of length";
  if (Validator.isEmpty(data.password))
    errors.password = "Password is required";

  // Password confirmation
  if (!Validator.equals(data.password, data.passwordconfirm))
    errors.passwordconfirm = "Passwords must match";
  if (Validator.isEmpty(data.passwordconfirm))
    errors.passwordconfirm = "Please confirm your password";

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

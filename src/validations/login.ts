import validator from "validator";
import isEmpty from "./is-empty";
export default function validateRegisterInput(data: {
  username?: string;
  password?: string;
}) {
  let errors: { username?: string; password?: string } = {};

  data.username = isEmpty(data.username) ? "" : data.username;
  data.password = isEmpty(data.password) ? "" : data.password;

  // Validate username
  if (validator.isEmpty(data.username!))
    errors.username = "Username is required";

  // Validate password
  if (validator.isEmpty(data.password!))
    errors.password = "Password is required";

  return { errors, isValid: isEmpty(errors) };
}

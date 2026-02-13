import UserModel from "../model/userModel/user.model.js";
import { createUser } from "../services/user.services.js";
import { validationResult } from "express-validator";

export const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

const { fullname, email, password } = req.body;

  const hashPassword = await UserModel.hashPassword(password);

  const user = await createUser({
    firstName: fullname.firstName,
    lastName: fullname.lastName,
    email,
    password: hashPassword,
  });
  const token = user.generateAuthToken();

  return res.status(201).json({ token, user });
};

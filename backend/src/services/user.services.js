import UserModel from "../model/userModel/user.model.js";

export const createUser = async ({ firstName,lastName, email, password }) => {
  if (!firstName || !email || !password) {
    throw new Error("All fields required");
  }

  const user = await UserModel.create({
    fullname: { firstName, lastName },
    email: email,
    password: password,
  });

  return user;
};

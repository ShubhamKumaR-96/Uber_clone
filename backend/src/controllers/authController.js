import UserModel from "../model/userModel/user.model.js";
import asyncHandler from "../middleware/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";

/**
 * @desc Register user
 * @route Post/api/v1/auth/register
 * @access public
 *
 *  */

export const register = asyncHandler(async (req, res, next) => {
  const { email, password, firstName, lastName, phone, role } = req.body;

  const userExits = await UserModel.findOne({
    $or: [{ email }, { phone }],
  });

  if (userExits) {
    return next(
      new ErrorResponse(
        userExits.email === email
          ? "Email already registered"
          : "Phone number already registered",
        400,
      ),
    );
  }

  // create user
  const user = await UserModel.create({
    email,
    password,
    firstName,
    lastName,
    phone,
    role: role || "rider",
  });

  // Remove password from Output
  user.password = undefined;

  // generate token
  const accessToken = user.generateAuthToken();
  const refreshToken = user.generateRefreshToken();

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user: user,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  });
});

/**
 * @desc Login User
 * @route POST/api/v1/auth/login
 * @access public
 */

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErrorResponse("Please provide valid email Id and password", 400),
    );
  }

  const user = await UserModel.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("invalid credential", 401));
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  if (!user.isActive) {
    return next(
      new ErrorResponse(
        "Account is deactivated,Plz support to customer care",
        403,
      ),
    );
  }

  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });

  // generate token
  const accessToken = user.generateAuthToken();
  const refreshToken = user.generateRefreshToken();

  user.password = undefined;

  res.status(200).json({
    success: true,
    message: "Login successfully",
    data: {
      user: user,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  });
});

// @desc get current user
// @route get/api/v1/auth/me
// @access Private

export const getMe = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user.id);
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }
  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

import { body, validationResult } from "express-validator";
import ErrorResponse from "../utils/errorResponse.js";

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: error.path,
      message: error.msg
    }));
    return next(
      new ErrorResponse(`validation error: ${errorMessages[0].message}`, 400),
    );
  }
  next();
};

export const validateRegister=[
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('password').notEmpty().withMessage("password is required").isLength({min:6}).withMessage('Password must be at least 6 characters').matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter').matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter').matches(/\d/).withMessage('Password must contain at least one number').matches(/[@$!%*?&]/).withMessage('Password must contain at least one special character'),
    body('firstName').trim().notEmpty().withMessage('First name is required').isLength({min:2}).withMessage('First name must be at least 2 characters'),
    body('lastName').trim().notEmpty().withMessage('Last name is required').isLength({min:2}).withMessage('Last name must be at least 2 characters'),
    body('phone').trim().notEmpty().withMessage('Phone number is required').matches(/^\d{10}$/).withMessage('Phone number must be 10 digits'),
    body('role').optional().isIn(['rider', 'admin', 'driver']).withMessage('Role must be either rider, admin, or driver'),

    validate,
]

export const validateLogin=[
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('password').notEmpty().withMessage("password is required"),
    validate,
]

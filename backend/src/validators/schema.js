import Joi from 'joi';

// Skema  Register
export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    'string.min': 'Username minimal harus 3 karakter!',
    'any.required': 'Username wajib diisi!'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Format email tidak valid!',
    'any.required': 'Email wajib diisi!'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password minimal harus 6 karakter!',
    'any.required': 'Password wajib diisi!'
  }),
  dateOfBirth: Joi.date().allow(null, ''),
  gender: Joi.string().valid('Male', 'Female').allow(null, ''),
  weight: Joi.number().allow(null, ''),
  height: Joi.number().allow(null, '')
});

// Skema Login
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Format email tidak valid!',
    'any.required': 'Email wajib diisi!'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password wajib diisi!'
  })
});
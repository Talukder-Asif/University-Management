import express from 'express';
import validateRequest from '../../Middleware/validateRequest';
import { AuthValidation } from './auth.validation';
import { AuthControllers } from './auth.controller';
import auth from '../../Middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
	'/login',
	validateRequest(AuthValidation.loginValidationSchema),
	AuthControllers.loginUser,
);

router.post(
	'/change-password',
	auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
	validateRequest(AuthValidation.changePasswordValidationSchema),
	AuthControllers.changePassword,
);

router.post(
	'/refresh-token',
	validateRequest(AuthValidation.refreshTokenValidationSchema),
	AuthControllers.refreshToken,
);

router.post(
	'/forget-password',
	validateRequest(AuthValidation.forgetPasswordValidationSchema),
	AuthControllers.forgetPassword,
);

router.post(
	'/reset-password',
	validateRequest(AuthValidation.resetPasswordValidationSchema),
	AuthControllers.resetPassword,
);

export const AuthRoute = router;

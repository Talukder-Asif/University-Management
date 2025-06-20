import express from 'express';
import { adminController } from './admin.controller';
import validateRequest from '../../Middleware/validateRequest';
import { adminValidation } from './admin.validation';

const router = express.Router();

router.get('/', adminController.getAllAdmin);
router.get('/:id', adminController.getSingleAdmin);
router.patch(
	'/:id',
	validateRequest(adminValidation.updateAdminValidationSchema),
	adminController.updateAdmin,
);
router.delete('/:id', adminController.deleteAdmin);

export const AdminRouter = router;

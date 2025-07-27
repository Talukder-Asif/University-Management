import config from '../config';
import { USER_ROLE } from '../modules/user/user.constant';
import User from '../modules/user/user.model';

const superUser = {
	id: '0001',
	password: config.super_admin_password,
	email: 'asif.talukder.aj.10@gmail.com',
	role: USER_ROLE.superAdmin,
	status: 'in-progress',
};

const seedSuperAdmin = async () => {
	// When database is connected, we will check is there any user who is super admin

	const isSuperAdminExist = await User.findOne({ role: USER_ROLE.superAdmin });

	if (!isSuperAdminExist) {
		await User.create(superUser);
	}
};

export default seedSuperAdmin;

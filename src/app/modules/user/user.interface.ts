export type TUser = {
    id: string;
    password: string;
    needsChangePassword: boolean;
    role :'admin'| 'student' | 'faculty';
    isDeleted: boolean;
    status: 'in-progress' | 'blocked';
}
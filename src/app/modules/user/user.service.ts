import { userValidation } from './user.validation';
import config from "../../config";
import { TStudent } from "../student/student.interface";
import { TUser } from "./user.interface";
import UserModel from "./user.model";
import { StudentModel } from '../student/student.model';


const createStudentIntoDB = async (password: string ,studentData : TStudent)=>{

    // Create a user 
    const userData : Partial<TUser> = {}

    // if password is not given then use default password
    userData.password = password || (config.default_password as string);

    // Set student role
    userData.role = 'student';
    userData.email = studentData.email;


    // Manually Generated ID
    userData.id = '20230010001'

    // create a user model 
    const result = await UserModel.create(userData);


    // Create a Student
    if(Object.keys(result).length){
        studentData.id = result.id;
        studentData.user = result._id

        const newStudent = await StudentModel.create(studentData);
        return newStudent;
    }

    return result;
}


export const UserService = {
    createStudentIntoDB
}
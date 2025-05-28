import { TUser } from './user.interface';
import { Request, Response } from "express";
import { UserService } from "./user.service";
import { userValidation } from "./user.validation";


const createStudent = async (req: Request, res: Response) => {
    try{

        const {password ,student} = req.body;
        // const zodParsedData =  userValidation?.userValidationSchema.parse(student);
        
        const result = await UserService.createStudentIntoDB(password, student);
        res.status(200).json({
            success: true,
            message: 'Student is Created successfully',
            data: result,
        });

    }catch(err){
        console.log(err)
    }
}


export const UserControllers = {
    createStudent
};
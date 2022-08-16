import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Authentication, Employee } from './entity';
import { Error } from './interface';
import *as  bcrypt from 'bcrypt';

@Injectable()
export class AppService {
        constructor(
                @InjectRepository(Authentication)
                private AR: Repository<Authentication>,

                @InjectRepository(Employee)
                private ER: Repository<Employee>,
        ) {}

        async newEmployee(body) {
                console.log(body.name);
                const data = await this.ER.findOne({
                        where: { name: body.name },
                });

                if (data == null) {
                        const userName = body.userName;
                        const pass = body.password;
			const saltRounds =10;
		const password = await bcrypt.hash(pass, saltRounds) 
                const matching = await bcrypt.compare (pass,password)        
			console.log(matching,password,pass)

                        const sec = { userName, password };
                        const auth = await this.AR.save(sec);

                        const employeeId = Math.floor(Math.random() * 1000);
                        const companyMail = `${body.name.toLowerCase()}@surfboard.se`;
                        const newEmp = { ...body, employeeId, companyMail };
                        console.log(newEmp);
                        const postEmp = await this.ER.save(newEmp);

                        console.log(
                                'New Employee details is  posted ',
                                postEmp,
                        );

                        return {
                                status: 'SUCCESS',
                                message: 'The Employee profile created successfully',
                        };
                
		}
		else {
                        throw new Error(
                                'Invalid Input : The Employee profile  is present already',
                        );
                }
	
        }

async getAllEmployee (){
       const getAll =await this.ER.find()
       return getAll;
}

async getEmployee(body){
        console.log(body.userName)
        const get = await this.AR.findOne({where: { userName:body.userName },});
        console.log(get)

      try{
        if (get.userName === body.userName){
       	 const hashedPass = get.password;
          const password = body.password;
          const matching = await bcrypt.compare(password,hashedPass);
          console.log(matching)

            if (matching === false){
                    return "Password is incorrect"
            }

            else{
                return await this.ER.findOne({where:{name:body.userName},});
            }

                  }
      }
      catch{
                  return "User Name doesn't exit"
}
}

async fireEmployee(body){
        const get = await this.AR.findOne({where: { userName:body.userName },});
        console.log(get)
      try{
        if (get.userName === body.userName){
        const hashedPass = get.password;
          const password = body.password;
          const matching = await bcrypt.compare(password,hashedPass);
          console.log(matching)

            if (matching === false){
	     return (`Password is incorrect`)
       }

       else{
        //const del = await this.ER.delete({name:body.userName})
         await this.ER.update({name:body.userName},{deleted:true})
               return (`you are fired`)
       }
       }
      }

      catch{
                  return "User Name doesn't exit"
}
}

async  updateEmployee(body){
       const get = await this.AR.findOne({where: { userName:body.userName },});
        console.log(get)
      try{
        if (get.userName === body.userName){
        const hashedPass = get.password;
          const password = body.password;
          const matching = await bcrypt.compare(password,hashedPass);
          console.log(matching)

            if (matching === false){
		    return (`Password is incorrect`)
       }

       else{
               const name = body.userName
        delete body.userName;
        delete body.password;
        await this.ER.update({name:name},body)
         return "Updated Successfully"
         }
       }
      }

      catch(err){
                  return `Errored while updating employee with message: ${err.message}`
}
}

}

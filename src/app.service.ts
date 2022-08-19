import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Authentication, Employee } from './entity';
import { Error } from './interface';
import *as  bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
        constructor(
                @InjectRepository(Authentication)
                private AR: Repository<Authentication>,

                @InjectRepository(Employee)
                private ER: Repository<Employee>,
               
               private jwtService: JwtService
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
			console.log('',matching,password,pass)

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

async logIn(body){
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
		//const arr=await this.ER.findOne({where:{name:body.userName},});
		const jwt = this.jwtService.sign(body.userName,{secret:'secretKey'})
	        console.log('jwt',jwt)
		return jwt
            }

                  }
      }
      catch(err){
	      return `User doesnot exit: ${err.message}`
}
}

async getEmployee(body) {
try{
	const auth = this.jwtService.verify(body.authorization,{secret:'secretKey'})
	console.log('run auth',auth)
	const arr=await this.ER.findOne({where:{name:auth},})
        console.log(arr)
	return arr
}
catch(err){
       return `Authorization failed: ${err.message}`
}
}

async fireEmployee(body){
      try{
            const auth = this.jwtService.verify(body.authorization,{secret:'secretKey'})
	    await this.ER.update({name:auth},{deleted:true})
               return (`you are fired`)
      }

      catch(err){
	      return `Authorization failed: ${err.message}`
}
}

async  updateEmployee(body,headers){
      try{
	      const auth = this.jwtService.verify(headers.authorization,{secret:'secretKey'})
            console.log('check',auth,body)
        await this.ER.update({name:auth},body)
         return "Updated Successfully"
         }

      catch(err){
	      return `Authorization failed: ${err.message}`
}
}

}

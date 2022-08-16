import { Entity, Column, PrimaryColumn, BaseEntity, Repository, EntityRepository }     from 'typeorm';

 @Entity('Authentication')
 export class Authentication extends BaseEntity {

  @PrimaryColumn()
   userName:string;

   @Column()
   password:string
 }


@Entity('Employee')
 export class Employee extends BaseEntity {
   @PrimaryColumn()
   employeeId:number;

   @Column()
   name:string

   @Column()
   company:string;

   @Column({ nullable:true})
  companyMail:string;

   @Column({ default: true })
   roll:string;

   @Column({ default: false })
    deleted:boolean;

 }

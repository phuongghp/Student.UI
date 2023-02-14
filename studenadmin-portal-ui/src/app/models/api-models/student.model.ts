import { Address } from "./address.model";
import { Gender } from "./gender.model";

export interface Student{
  id: string,
  lastName:string,
  firstName:string,
  dateOfBirth:string,
  email:string,
  mobile:number,
  profileImageUrl:string,
  genderId:string,
  gender:Gender,
  address:Address
}

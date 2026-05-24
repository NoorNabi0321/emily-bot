import { db } from "../config/db";

export async function ensureUserExists(
 phone:string
){

 try{

 await db.query(
 `
 INSERT INTO whatsapp_users
 (phone_number)

 VALUES($1)

 ON CONFLICT(phone_number)

 DO NOTHING
 `,
 [phone]
 );

 console.log("User Checked");

 }catch(error){

 console.error(
 "User Registration Failed:",
 error
 );

 }

}
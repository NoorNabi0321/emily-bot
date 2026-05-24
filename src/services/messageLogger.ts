import { db } from "../config/db";

export async function saveMessage(
 phone:string,
 direction:string,
 body:string
){

 try{

 await db.query(
 `
 INSERT INTO messages
 (phone_number,direction,body)
 VALUES($1,$2,$3)
 `,
 [phone,direction,body]
 );

 console.log("Message Saved");

 }catch(error){

 console.error("Message Save Failed:",error);

 }

}
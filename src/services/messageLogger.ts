import { db } from "../config/db";

export async function saveMessage(
 phone:string,
 direction:string,
 body:string
){

 await db.query(
 `
 INSERT INTO messages
 (phone_number,direction,body)
 VALUES($1,$2,$3)
 `,
 [phone,direction,body]
 );

}
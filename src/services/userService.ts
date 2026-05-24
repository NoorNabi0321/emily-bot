import { db } from "../config/db";

export async function ensureUserExists(
 phone:string
){

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

}
import { db } from "../config/db";

export async function getUserRole(
 phone:string
){

 const result=
 await db.query(
 `
 SELECT role,is_active

 FROM whatsapp_users

 WHERE phone_number=$1
 `,
 [phone]
 );

 if(
 result.rows.length===0
 ){

 return null;

 }

 return result.rows[0];

}
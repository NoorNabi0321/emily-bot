import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

export const db = new pg.Pool({
 connectionString: process.env.DATABASE_URL,
 ssl:{
  rejectUnauthorized:false
 }
});

db.connect()
.then(()=>{
 console.log("Database Connected");
})
.catch((err)=>{
 console.error("Database Failed:",err);
});
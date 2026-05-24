import { db } from "./config/db";

db.query("SELECT NOW()")
.then(()=>{
 console.log("Database Connected");
})
.catch((err)=>{
 console.error("Database Error:", err);
});
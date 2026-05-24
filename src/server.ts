import { db } from "./config/db";

db.query("SELECT NOW()")
.then(()=>{
 console.log("Database Connected");
})
.catch(console.error);
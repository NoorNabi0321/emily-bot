import express from "express";
import dotenv from "dotenv";

import { twilioRouter } from "./webhooks/twilio";

import {
 boltedIron
}
from "./clients/boltedIronClient";

// Uncomment after creating middleware/twilioAuth.ts
// import { verifyTwilio } from "./middleware/twilioAuth";

dotenv.config();

const app = express();

app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Emily Bot API Online 🚀");
});

app.get("/health", (req, res) => {
  res.send("Emily Bot Running");
});

// Current Working Route
app.use(
  "/webhook",
  twilioRouter
);

/*
Later replace with:

app.use(
 "/webhook",
 verifyTwilio,
 twilioRouter
);

after creating Twilio auth middleware
*/

const PORT = Number(process.env.PORT) || 3000;

console.log("Server Starting...");

async function
testBIH(){

 try{

 console.log(
 "Testing BIH..."
 );

 const projects=

 await boltedIron
 .getProjects();

 console.log(

 "BIH Connected"

 );

 console.log(
 projects
 ?.length
 ??

 0
 );

 }catch(error){

 console.error(

 "BIH Failed:",

 error

 );

 }

}

testBIH();

app.listen(PORT, () => {
  console.log(`Emily Bot running on ${PORT}`);
});

process.on("uncaughtException", (err) => {
  console.error(
    "Uncaught Exception:",
    err
  );
});

process.on(
  "unhandledRejection",
  (reason) => {
    console.error(
      "Unhandled Promise Rejection:",
      reason
    );
  }
);
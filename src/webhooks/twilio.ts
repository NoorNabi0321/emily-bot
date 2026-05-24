import { Router } from "express";

export const twilioRouter = Router();

twilioRouter.post("/whatsapp", async (req,res)=>{

 const from=req.body.From;
 const body=req.body.Body;

 console.log("Sender:",from);
 console.log("Message:",body);

 let reply="I did not understand.";

 if(body.toLowerCase().includes("hello")){
   reply="Hello! Emily Bot is online 🚀";
 }

 if(body.toLowerCase().includes("projects")){
   reply="Project system will connect soon.";
 }

 res.set("Content-Type","text/xml");

 res.send(`
<Response>
<Message>${reply}</Message>
</Response>
`);

});
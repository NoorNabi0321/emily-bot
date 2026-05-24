import { saveMessage } from "../services/messageLogger";

twilioRouter.post("/whatsapp", async(req,res)=>{

 const from=req.body.From;
 const body=req.body.Body;

 await saveMessage(
   from,
   "inbound",
   body
 );

 let reply="Emily received your message.";

 if(body.toLowerCase().includes("hello")){
   reply="Hello Emily User 🚀";
 }

 await saveMessage(
   from,
   "outbound",
   reply
 );

 res.set("Content-Type","text/xml");

 res.send(`
<Response>
<Message>${reply}</Message>
</Response>
`);

});
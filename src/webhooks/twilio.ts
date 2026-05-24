import { Router } from "express";

import {
 saveMessage
} from "../services/messageLogger";

import {
 ensureUserExists
} from "../services/userService";

export const twilioRouter=Router();

twilioRouter.post(
"/whatsapp",

async(req,res)=>{

try{

const from=
req.body.From || "";

const body=
req.body.Body || "";

console.log(
"Sender:",
from
);

console.log(
"Message:",
body
);

await ensureUserExists(
from
);

await saveMessage(
from,
"inbound",
body
);

let reply=
"Emily received your message 🚀";

if(
body
.toLowerCase()
.includes("hello")
){

reply=
"Hello Emily User 🚀";

}

await saveMessage(
from,
"outbound",
reply
);

res.set(
"Content-Type",
"text/xml"
);

res.send(`
<Response>
<Message>
${reply}
</Message>
</Response>
`);

}catch(error){

console.error(
"Webhook Failed:",
error
);

res.status(500)
.send("Error");

}

}
);
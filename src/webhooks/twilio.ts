import { Router } from "express";

import {
 saveMessage
} from "../services/messageLogger";

import {
 ensureUserExists
} from "../services/userService";

import {
 getUserRole
}
from "../services/permissionService";

import {
 parseIntent
}
from "../services/claude";

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

const user=
await getUserRole(
from
);

if(
!user?.is_active
){

return res.send(`
<Response>
<Message>
Access denied.
</Message>
</Response>
`);

}

await saveMessage(
from,
"inbound",
body
);

let reply =
"Emily received your message 🚀";

try{

const aiResponse =
await parseIntent(
body
);

if(
aiResponse.intent
==="greeting"
){

reply=
"Hello 👋 Emily Bot is online.";

}
else if(
aiResponse.intent
==="project_query"
){

reply=
"Project system integration coming next 🚀";

}
else if(
aiResponse.intent
==="status_update"
){

reply=
"Project status update capability detected.";

}
else{

reply=
"I could not understand that request.";

}

}catch(error){

console.error(
"Claude Error:",
error
);

reply =
"Emily AI temporarily unavailable.";

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
import { Router } from "express";

import {
 saveMessage
}
from "../services/messageLogger";

import {
 ensureUserExists
}
from "../services/userService";

import {
 getUserRole
}
from "../services/permissionService";

import {
 parseIntent
}
from "../services/claude";

import {
 boltedIron
}
from "../clients/boltedIronClient";

export const twilioRouter=
Router();

twilioRouter.post(
"/whatsapp",

async(req,res)=>{

try{

const from=

req.body.From
||"";

const body=

req.body.Body
||"";

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

return res.send(

`
<Response>

<Message>

Access denied.

</Message>

</Response>
`

);

}

await saveMessage(

from,

"inbound",

body

);

let reply=

"Emily Bot Ready 🚀";

const message=

body
.toLowerCase()
.trim();

if(

message
==="projects"

){

try{

const projects=

await boltedIron
.getProjects();

const list=

projects
?.json

||

projects

||

[];

if(

!list.length

){

reply=

"No projects found.";

}

else{

reply=

list

.slice(
0,
5
)

.map(

(
project:any
)=>

`📍 ${project.name}

ID:
${project.id}`

)

.join(

"\n\n"

);

}

}catch(error){

console.error(
error
);

reply=

"Could not fetch projects.";

}

}

else if(

message
.startsWith(
"project "
)

){

try{

const id=

Number(

message
.replace(
"project ",
""
)

);

const project=

await boltedIron
.getProject(
id
);

const data=

project
?.json

||

project;

reply=

`
📍 ${
data.name
||

"Unknown"
}

🏢 ${
data.address
||

"N/A"
}

📊 ${
data.status
||

"N/A"
}
`;

}catch(error){

console.error(
error
);

reply=

"Project not found.";

}

}

else{

try{

const aiResponse=

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

`
Try:

Projects

or

Project 1680001
`;

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

reply=

"Emily AI temporarily unavailable.";

}

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

res.send(

`
<Response>

<Message>

${reply}

</Message>

</Response>
`

);

}catch(error){

console.error(

"Webhook Failed:",

error

);

res
.status(500)
.send(
"Error"
);

}

}

);
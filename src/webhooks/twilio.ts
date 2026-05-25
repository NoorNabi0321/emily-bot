import { Router }
from "express";

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

`<Response>
<Message>
Access denied
</Message>
</Response>`

);

}

await saveMessage(

from,
"inbound",
body

);

let reply="";

try{

const ai=

await parseIntent(
body
);

if(

ai.intent===
"greeting"

){

reply=

"Hello 👋 Emily Bot online.";

}

else if(

ai.intent===
"project_list"

){

const filters:any={};

if(
ai.status
){

filters.status=
ai.status;

}

const projects=

await boltedIron
.getProjects(
filters
);

const list=

projects?.json

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

`Projects (${list.length})

`+

list

.slice(
0,
10
)

.map(

(p:any)=>

`• ${p.name}`

)

.join("\n");

}

}

else if(

ai.intent===
"project_detail"

){

const project=

await boltedIron
.searchProject(

ai.projectName

);

if(
!project
){

reply=

"Project not found.";

}

else{

const assignments=

await boltedIron
.getAssignments(

project.id

);

reply=

`
📍 ${project.name}

Status:
${project.status||"N/A"}

Address:
${project.address||"N/A"}

Start:
${project.startDate||"N/A"}

End:
${project.endDate||"N/A"}

Subcontractors:

${

JSON.stringify(
assignments
)

.slice(
0,
250
)

}
`;

}

}

else if(

ai.intent===
"project_checklist"

){

const project=

await boltedIron
.searchProject(

ai.projectName

);

if(
!project
){

reply=
"Project not found.";

}

else{

const checklist=

await boltedIron
.getChecklist(

project.id

);

reply=

`Checklist

${

JSON.stringify(

checklist

)

.slice(
0,
900
)

}`;

}

}

else{

reply=

"I could not understand.";

}

}catch(error){

console.error(
error
);

reply=

"Emily AI unavailable.";

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
error
);

res
.status(500)
.send("Error");

}

}

);
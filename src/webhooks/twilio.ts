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

function formatDate(

date:any

){

if(
!date
){

return "N/A";

}

try{

return new Date(
date
)

.toLocaleDateString(

"en-US",

{

year:"numeric",

month:"short",

day:"numeric"

}

);

}catch{

return "N/A";

}

}

function formatAssignments(

data:any

){

if(
!data
){

return "None";

}

const raw=

data?.json

||

data

||

[];

if(
!Array.isArray(
raw
)
){

return "None";

}

if(
!raw.length
){

return "None";

}

return raw

.slice(
0,
5
)

.map(

(x:any)=>{

const sub=

x.subcontractor;

if(
!sub
){

return "• Unknown";

}

return

`• ${

sub.companyName

||

sub.contactName

||

"Unknown"

}`;

}

)

.join(
"\n"
);

}

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

console.log(
"Claude:",
ai
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

const projects=

await boltedIron
.getProjects({

status:
ai.status,

date:
ai.date,

limit:
ai.limit,

subcontractor:
ai.subcontractor

});

if(
!projects.length
){

reply=

"No projects found.";

}

else{

reply=

`Projects (${projects.length})

`+

projects

.map(

(
p:any,
i:number
)=>

`${

i+1

}. ${

p.name

}`

)

.join(
"\n"
);

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
${formatDate(
project.startDate
)}

End:
${formatDate(
project.endDate
)}

Subcontractors:

${

formatAssignments(

assignments

)

}

Project ID:

${project.id}

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

const items=

checklist?.json

||

checklist

||

[];

reply=

`Checklist

${

items

.slice(
0,
10
)

.map(

(
x:any
)=>

`• ${

x.name

||

x.title

||

"Task"

}`

)

.join(
"\n"
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
.send(
"Error"
);

}

}

);
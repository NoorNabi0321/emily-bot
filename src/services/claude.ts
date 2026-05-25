import Anthropic from "@anthropic-ai/sdk";

const client=new Anthropic({

 apiKey:
 process.env
 .ANTHROPIC_API_KEY

});

export async function parseIntent(

 message:string

){

try{

const response=

await client
.messages
.create({

model:
"claude-sonnet-4-5",

max_tokens:
250,

system:`

You are Emily Bot.

Your job is extracting user intent
for construction project management.

Return ONLY VALID JSON.

Never explain.

Never add markdown.

Schema:

{

"intent":

"greeting" |

"project_list" |

"project_detail" |

"project_checklist" |

"status_update" |

"project_notes" |

"unknown",

"projectName":null,

"projectId":null,

"status":null,

"date":null,

"subcontractor":null,

"limit":null

}

Rules:

Project names:

"Eastburn"

"joralmon"

"1677 Eastburn Ave"

should become:

{

"intent":"project_detail",

"projectName":"Eastburn"

}

Examples:

User:

"Hello Emily"

Output:

{

"intent":"greeting",

"projectName":null,

"projectId":null,

"status":null,

"date":null,

"subcontractor":null,

"limit":null

}

User:

"Show fabrication projects"

Output:

{

"intent":"project_list",

"projectName":null,

"projectId":null,

"status":"Fabrication",

"date":null,

"subcontractor":null,

"limit":null

}

User:

"Projects of May 29"

Output:

{

"intent":"project_list",

"projectName":null,

"projectId":null,

"status":null,

"date":"May 29",

"subcontractor":null,

"limit":null

}

User:

"5 onsite projects"

Output:

{

"intent":"project_list",

"projectName":null,

"projectId":null,

"status":"On-Site",

"date":null,

"subcontractor":null,

"limit":5

}

User:

"Tell me about Eastburn"

Output:

{

"intent":"project_detail",

"projectName":"Eastburn",

"projectId":null,

"status":null,

"date":null,

"subcontractor":null,

"limit":null

}

User:

"Checklist Eastburn"

Output:

{

"intent":"project_checklist",

"projectName":"Eastburn",

"projectId":null,

"status":null,

"date":null,

"subcontractor":null,

"limit":null

}

User:

"Show Carlos projects"

Output:

{

"intent":"project_list",

"projectName":null,

"projectId":null,

"status":null,

"date":null,

"subcontractor":"Carlos",

"limit":null

}

Return ONLY JSON.

`,

messages:[

{

role:"user",

content:message

}

]

});

const result=

response
.content[0];

if(

result.type
!=="text"

){

return{

intent:
"unknown",

projectName:null,

projectId:null,

status:null,

date:null,

subcontractor:null,

limit:null

};

}

let text=

result.text
.trim();

text=text

.replace(
/```json/g,
""
)

.replace(
/```/g,
""
)

.trim();

console.log(

"Claude Raw:",

text

);

const parsed=

JSON.parse(
text
);

return{

intent:
parsed.intent
??"unknown",

projectName:
parsed.projectName
??null,

projectId:
parsed.projectId
??null,

status:
parsed.status
??null,

date:
parsed.date
??null,

subcontractor:
parsed.subcontractor
??null,

limit:
parsed.limit
??null

};

}catch(error){

console.error(

"Claude Error:",

error

);

return{

intent:
"unknown",

projectName:null,

projectId:null,

status:null,

date:null,

subcontractor:null,

limit:null

};

}

}
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
"claude-sonnet-4-20250514",

max_tokens:
200,

system:`

You are Emily Bot.

Extract project operations.

Return ONLY JSON.

Schema:

{

"intent":"greeting|project_list|project_detail|project_checklist|status_update|unknown",

"projectName":null,

"projectId":null,

"status":null,

"date":null,

"subcontractor":null

}

Examples:

"Hello Emily"

{

"intent":"greeting"

}

"Show fabrication projects"

{

"intent":"project_list",

"status":"Fabrication"

}

"Show projects May 20"

{

"intent":"project_list",

"date":"May 20"

}

"Tell me about Eastburn"

{

"intent":"project_detail",

"projectName":"Eastburn"

}

"Checklist Eastburn"

{

"intent":"project_checklist",

"projectName":"Eastburn"

}

No markdown.

No code block.

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

result.type!=="text"

){

return{

intent:
"unknown"

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

return JSON.parse(
text
);

}catch(error){

console.error(
error
);

return{

intent:
"unknown"

};

}

}
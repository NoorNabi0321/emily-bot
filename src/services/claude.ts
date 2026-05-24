import Anthropic
from "@anthropic-ai/sdk";

const client=
new Anthropic({

apiKey:
process.env
.ANTHROPIC_API_KEY

});

export async function
parseIntent(
message:string
){

const response=
await client
.messages
.create({

model:
"claude-sonnet-4-20250514",

max_tokens:150,

messages:[
{
role:"user",
content:
`
Classify intent:

${message}

Return ONLY:

help
project_query
status_update
unknown
`
}
]

});

return response
.content[0];

}
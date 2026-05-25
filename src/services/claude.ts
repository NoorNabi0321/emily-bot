import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
 apiKey: process.env.ANTHROPIC_API_KEY
});

export async function parseIntent(
 message:string
){

 try{

 const response =
 await client.messages.create({

 model:"claude-sonnet-4-0",

 max_tokens:100,

 system:
`
You are Emily Bot.

You classify WhatsApp project-management messages.

Allowed intents:

help
project_query
status_update
greeting
unknown

Rules:

hello
hi
hey

→ greeting

show projects
list projects
project details

→ project_query

change status
update project
mark done

→ status_update

If uncertain → unknown

Return ONLY JSON.

Example:

{
 "intent":"greeting"
}
`,

 messages:[
 {
 role:"user",
 content:message
 }
 ]

 });

 const result =
 response.content[0];

 if(
 result.type!=="text"
 ){

 return {
 intent:"unknown"
 };

 }

 const text =
 result.text
 .trim();

 console.log(
 "Claude Raw:",
 text
 );

 return JSON.parse(
 text
 );

 }catch(error){

 console.error(
 "Claude Error:",
 error
 );

 return {

 intent:
 "unknown"

 };

 }

}
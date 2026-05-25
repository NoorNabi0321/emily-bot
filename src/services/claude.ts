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

 model:"claude-sonnet-4-5",

 max_tokens:100,

 system:`
You are Emily Bot.

Classify user messages.

Possible intents:

greeting
project_query
status_update
help
unknown

Examples:

"hello" -> greeting

"show projects" -> project_query

"mark project done" -> status_update

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

 return JSON.parse(
 result.text
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
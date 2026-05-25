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

Classify messages.

Allowed intents:

greeting
project_query
status_update
help
unknown

Return ONLY valid JSON.

Do NOT use markdown.

Do NOT use \`\`\`json.

Example:

{"intent":"greeting"}
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

 let text =
 result.text.trim();

 console.log(
 "Claude Raw:",
 text
 );

 text =
 text
 .replace(/```json/g,"")
 .replace(/```/g,"")
 .trim();

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
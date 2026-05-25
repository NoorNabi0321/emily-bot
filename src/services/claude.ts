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

 max_tokens:150,

 messages:[
 {
 role:"user",
 content:`
You are Emily Bot.

User Message:

${message}

Classify intent.

Possible intents:

help
project_query
status_update
unknown

Return ONLY JSON:

{
 "intent":"value"
}
`
 }
 ]

 });

 const text =
 response.content[0]
 ?.type==="text"

 ?response.content[0].text

 :'{"intent":"unknown"}';

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
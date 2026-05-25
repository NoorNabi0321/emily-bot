import fetch from "node-fetch";

interface SessionData{

 sessionCookie:string;

 expiresAt:number;

}

let cache:
SessionData|null=null;

async function login(){

 const response=
 await fetch(

 `${process.env.BOLTED_IRON_API_URL}/auth.login`,

 {

 method:"POST",

 headers:{
 "Content-Type":
 "application/json"
 },

 body:JSON.stringify({

 email:
 process.env
 .BOLTED_IRON_BOT_EMAIL,

 password:
 process.env
 .BOLTED_IRON_BOT_PASSWORD

 })

 }

 );

 if(
 !response.ok
 ){

 throw new Error(
 `BIH Login Failed:
 ${response.status}`
 );

 }

 const data=
 await response.json();

 return data.sessionCookie;

}

async function getSession(){

 const now=
 Date.now();

 if(

 cache &&

 cache.expiresAt>now

 ){

 return cache
 .sessionCookie;

 }

 const session=
 await login();

 cache={

 sessionCookie:
 session,

 expiresAt:

 now+

 (
 23*
 60*
 60*
 1000
 )

 };

 return session;

}

async function trpc(

 procedure:string,

 input:any

){

 const session=
 await getSession();

 const response=
 await fetch(

 `${process.env.BOLTED_IRON_API_URL}/${procedure}`,

 {

 method:"POST",

 headers:{

 "Content-Type":
 "application/json",

 Cookie:
 `session=${session}`

 },

 body:
 JSON.stringify(
 input
 )

 }

 );

 if(
 !response.ok
 ){

 throw new Error(

 `BIH Error:
 ${response.status}`

 );

 }

 const data=
 await response.json();

 return data
 ?.result
 ?.data

 ??data;

}

export const
boltedIron={

 getProjects(){

 return trpc(

 "projects.list",

 {}

 );

 },

 getChecklist(

 projectId:number

 ){

 return trpc(

 "checklists.getByProject",

 {

 projectId

 }

 );

 }

};
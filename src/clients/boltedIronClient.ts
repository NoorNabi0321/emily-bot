import fetch from "node-fetch";

interface TrpcResponse{

 result?:{
  data?:any;
 };

 error?:any;

 [key:string]:any;

}

const QUERY_PROCEDURES=[

 "projects.list",
 "projects.get",
 "projects.getByStatus",

 "projects.getAssignmentsWithDetails",

 "subcontractors.list",
 "subcontractors.get",

 "checklists.getByProject",

 "notes.getByProject",

 "files.list"

];

async function callTrpc(

 procedure:string,

 input:any={}

):Promise<any>{

 const apiUrl=
 process.env
 .BOLTED_IRON_API_URL;

 const bearerToken=
 process.env
 .BOLTED_IRON_BEARER_TOKEN;

 if(
 !apiUrl||
 !bearerToken
 ){

 throw new Error(
 "Missing BIH Variables"
 );

 }

 const isQuery=

 QUERY_PROCEDURES
 .includes(
 procedure
 );

 let url=
 `${apiUrl}/${procedure}`;

 const headers:any={

 Authorization:
 `Bearer ${bearerToken}`,

 "Content-Type":
 "application/json"

 };

 const options:any={
 headers
 };

 if(isQuery){

 options.method=
 "GET";

 if(
 Object.keys(input)
 .length
 ){

 url+=

 `?input=${encodeURIComponent(

 JSON.stringify({

 json:input

 })

 )}`;

 }

 }

 else{

 options.method=
 "POST";

 options.body=

 JSON.stringify(
 input
 );

 }

 console.log(
 `[BIH] Calling ${procedure}...`
 );

 const response=

 await fetch(
 url,
 options
 );

 const raw=

 await response
 .text();

 console.log(
 `[BIH] ${procedure} Status:`,
 response.status
 );

 if(
 !response.ok
 ){

 let error=

 response.statusText;

 try{

 const parsed=
 JSON.parse(raw);

 error=

 parsed
 ?.error
 ?.json
 ?.message

 ||

 error;

 }catch{}

 throw new Error(

 `${procedure}

${response.status}

${error}`

 );

 }

 const data=
 JSON.parse(
 raw
 )as TrpcResponse;

 return(

 data
 ?.result
 ?.data

 ||

 data

 );

}

export const boltedIron={

 async getProjects(

 filters:any={}

 ){

 return callTrpc(

 "projects.list",

 filters

 );

 },

 async searchProject(

 name:string

 ){

 const response=

 await this
 .getProjects();

 const list=

 response
 ?.json

 ||

 response

 ||

 [];

 return list.find(

 (p:any)=>

 p.name

 ?.toLowerCase()

 .includes(

 name
 .toLowerCase()

 )

 );

 },

 async getProject(

 projectId:number

 ){

 return callTrpc(

 "projects.get",

 {

 id:
 projectId

 }

 );

 },

 async getAssignments(

 projectId:number

 ){

 return callTrpc(

 "projects.getAssignmentsWithDetails",

 {

 projectId

 }

 );

 },

 async getChecklist(

 projectId:number

 ){

 return callTrpc(

 "checklists.getByProject",

 {

 projectId

 }

 );

 },

 async getProjectsByStatus(

 status:string

 ){

 return this
 .getProjects({

 status

 });

 }

};
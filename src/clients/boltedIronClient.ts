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

 "checklists.list",

 "notes.list",

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

 !apiUrl ||

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

 Object.keys(
 input
 ).length

 ){

 url+=

 `?input=${encodeURIComponent(

 JSON.stringify({

 json:input

 })

 )}`;

 }

 }

else {

  options.method =
    "POST";

  options.body =
    JSON.stringify({
      json: input
    });

}

console.log("API URL:", url);

console.log(
  "TOKEN PREFIX:",
  bearerToken?.substring(0, 10)
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

 response
 .statusText;

 try{

 const parsed=

 JSON.parse(
 raw
 );

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
 ) as TrpcResponse;

 return(

 data
 ?.result
 ?.data

 ||

 data

 );

}

function normalizeProjects(

 projects:any

){

 return(

 projects?.json

 ||

 projects

 ||

 []

 );

}

function contains(

 value:any,

 search:string

){

 return(

 value

 ?.toString()

 .toLowerCase()

 .includes(

 search
 .toLowerCase()

 )

 );

}

export const boltedIron={

async getSubcontractors() {
  return callTrpc(
    "subcontractors.list"
  );
},

async getSubcontractor(
  subcontractorId: number
) {
  return callTrpc(
    "subcontractors.get",
    {
      id: subcontractorId
    }
  );
},

async searchSubcontractor(
  name: string
) {
  const raw =
    await this.getSubcontractors();

  const subs =
    raw?.json ||
    raw ||
    [];

  return subs.find(
    (s: any) =>
      contains(
        s.companyName,
        name
      ) ||
      contains(
        s.contactName,
        name
      )
  );
},

 async getProjects(

 filters:any={}

 ){

 let projects=

 normalizeProjects(

 await callTrpc(

 "projects.list"

 )

 );

 if(
 filters.status
 ){

 projects=

 projects.filter(

 (p:any)=>

 contains(

 p.status,

 filters.status

 )

 );

 }

 if(
 filters.date
 ){

 projects=

 projects.filter(

 (p:any)=>{

 const start=

 p.startDate

 ||

 p.createdAt

 ||

 "";

 return contains(

 start,

 filters.date

 );

 }

 );

 }

 if(
 filters.projectName
 ){

 projects=

 projects.filter(

 (p:any)=>

 contains(

 p.name,

 filters.projectName

 )

 );

 }

 if(
 filters.limit
 ){

 projects=

 projects.slice(

 0,

 Number(
 filters.limit
 )

 );

 }

 if(
 filters.subcontractor
 ){

 const assignments=

 await Promise.all(

 projects.map(

 async(
 p:any
 )=>{

 try{

 const data=

 await this
 .getAssignments(

 p.id

 );

 return{

 project:p,

 assignment:data

 };

 }

 catch{

 return null;

 }

 }

 )

 );

 projects=

 assignments

 .filter(

 (x:any)=>{

 if(
 !x
 ){

 return false;

 }

 const raw=

 JSON.stringify(

 x.assignment

 );

 return contains(

 raw,

 filters.subcontractor

 );

 }

 )

 .map(

 (
 x:any
 )=>

 x.project

 );

 }

 return projects;

 },

 async searchProject(

 name:string

 ){

 const projects=

 await this
 .getProjects({

 projectName:
 name

 });

 return projects[0];

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
  projectId: number
) {

  return callTrpc(
    "checklists.list",
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

 },

async getNotes(
  projectId: number
) {

  return callTrpc(
    "notes.list",
    {
      projectId
    }
  );

},

async markChecklistComplete(
  checklistId: number
) {

  return callTrpc(
    "checklists.markComplete",
    {
      id: checklistId
    }
  );

},

async updateProjectStatus(
  projectId: number,
  status: string
) {

  return callTrpc(
    "projects.updateStatus",
    {
      id: projectId,
      status
    }
  );

},

async updateProjectDates(
  projectId: number,
  data: Record<string, unknown>
) {

  return callTrpc(
    "projects.update",
    {
      id: projectId,
      data
    }
  );

},

async createNote(
  projectId: number,
  content: string
) {

  return callTrpc(
    "notes.create",
    {
      projectId,
      content,
      isAdminOnly: false
    }
  );

},

};
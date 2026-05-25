import fetch from "node-fetch";

interface TrpcResponse {

  result?: {

    data?: any;

  };

  error?: any;

  [key:string]:any;

}

const QUERY_PROCEDURES=[

  "projects.list",
  "projects.get",
  "projects.getByStatus",

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

    !apiUrl ||

    !bearerToken

  ){

    throw new Error(

      "Missing BIH Variables"

    );

  }

  console.log(

    `[BIH] Calling ${procedure}...`

  );

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

  if(
 isQuery
){

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

  else{

    options.method=
    "POST";

    options.body=

    JSON.stringify(
      input
    );

  }

  const response=

  await fetch(

    url,

    options

  );

  console.log(

    `[BIH] ${procedure} Status:`,

    response.status

  );

  const raw=

  await response.text();

  console.log(

    `[BIH] ${procedure} Response:`,

    raw.substring(
      0,
      200
    )

  );

  if(
    !response.ok
  ){

    let errorMessage=

    response
    .statusText;

    try{

      const error=

      JSON.parse(
        raw
      );

      errorMessage=

      error
      ?.error
      ?.json
      ?.message

      ||

      errorMessage;

    }

    catch{}

    throw new Error(

      `BIH Error:

${response.status}

${errorMessage}`

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

export const boltedIron={

  getProjects(){

    return callTrpc(

      "projects.list"

    );

  },

  getProject(

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

  getProjectsByStatus(

    status:string

  ){

    return callTrpc(

      "projects.getByStatus",

      {

        status

      }

    );

  },

  updateProjectStatus(

    projectId:number,

    status:string

  ){

    return callTrpc(

      "projects.updateStatus",

      {

        id:
        projectId,

        status

      }

    );

  },

  assignSubcontractor(

    projectId:number,

    subcontractorId:number,

    role:string

  ){

    return callTrpc(

      "projects.addAssignment",

      {

        projectId,

        subcontractorId,

        role

      }

    );

  },

  removeSubcontractor(

    assignmentId:number

  ){

    return callTrpc(

      "projects.deleteAssignment",

      {

        id:
        assignmentId

      }

    );

  },

  getSubcontractors(){

    return callTrpc(

      "subcontractors.list"

    );

  },

  getChecklistItems(

    projectId:number

  ){

    return callTrpc(

      "checklists.getByProject",

      {

        projectId

      }

    );

  },

  updateChecklistItem(

    itemId:number,

    completed:boolean

  ){

    return callTrpc(

      "checklists.update",

      {

        id:
        itemId,

        completed

      }

    );

  },

  getProjectNotes(

    projectId:number

  ){

    return callTrpc(

      "notes.getByProject",

      {

        projectId

      }

    );

  },

  addProjectNote(

    projectId:number,

    content:string

  ){

    return callTrpc(

      "notes.create",

      {

        projectId,

        content

      }

    );

  }

};
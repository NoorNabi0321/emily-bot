import fetch from "node-fetch";

interface SessionData {

  sessionCookie:string;

  expiresAt:number;

}

interface TrpcResponse{

  result?:{

    data?:any;

  };

  sessionCookie?:string;

  error?:any;

  [key:string]:any;

}

let cache:
SessionData|null=null;

async function login(){

 console.log(
 "BIH URL:",
 process.env
 .BOLTED_IRON_API_URL
 );

 const response=
 await fetch(

 `${process.env.BOLTED_IRON_API_URL}/auth.login`,

 {

 method:"POST",

 headers:{

 "Content-Type":
 "application/json"

 },

 body:
 JSON.stringify({

 json:{

 email:
 process.env
 .BOLTED_IRON_BOT_EMAIL,

 password:
 process.env
 .BOLTED_IRON_BOT_PASSWORD

 }

 })

 }

 );

 console.log(

 "BIH Login Status:",

 response.status

 );

 const raw=
 await response.text();

 console.log(

 "BIH Login Raw:",

 raw

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
 JSON.parse(
 raw
 ) as TrpcResponse;

 const cookie=

 data
 ?.sessionCookie

 ||

 data
 ?.result
 ?.data
 ?.sessionCookie

 ||

 null;

 if(
 !cookie
 ){

 throw new Error(
 "Session cookie missing"
 );

 }

 return cookie;

}

async function getSession(){

  const now=
  Date.now();

  if(

    cache &&

    cache.expiresAt>
    now

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

  console.log(

    "BIH Procedure:",

    procedure,

    response.status

  );

  const raw=
  await response.text();

  console.log(

    "BIH Response:",

    raw

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
  JSON.parse(
    raw
  ) as TrpcResponse;

  return (

    data
    ?.result
    ?.data

    ||

    data

  );

}

export const
boltedIron={

  async getProjects(){

    return trpc(

      "projects.list",

      {}

    );

  },

  async getChecklist(

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
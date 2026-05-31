import { Router }
from "express";

import {
 saveMessage
}
from "../services/messageLogger";

import {
 ensureUserExists
}
from "../services/userService";

import {
 getUserRole
}
from "../services/permissionService";

import {
 parseIntent
}
from "../services/claude";

import {
  validateIntent
} from "../services/validators";

import {
  executeIntent
} from "../services/intentDispatcher";

export const twilioRouter=
Router();



twilioRouter.post(

"/whatsapp",

async(req,res)=>{

try{

const from=

req.body.From
||"";

const body=

req.body.Body
||"";

await ensureUserExists(
from
);

const user=

await getUserRole(
from
);

if(
!user?.is_active
){

return res.send(

`<Response>
<Message>
Access denied
</Message>
</Response>`

);

}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

await saveMessage(

from,

"inbound",

body

);

let reply="";

try {

  const ai = await parseIntent(body);

  console.log("Claude:", ai);

  if (!ai.success || !ai.intent) {
    reply = ai.error || "Could not understand request.";
  } else {

    const validation =
      validateIntent(ai.intent);

    if (!validation.valid) {

      reply =
        validation.error ||
        "Invalid request.";

    } else {

        reply =
        await executeIntent(
            ai.intent,
            user
        );

    }

  }

} catch (error) {

  console.error(error);

  reply =
    "Emily AI unavailable.";

}

await saveMessage(

from,

"outbound",

reply

);

res.set(

"Content-Type",

"text/xml"

);

res.send(

`
<Response>

<Message>

${escapeXml(reply)}

</Message>

</Response>
`

);

}catch(error){

console.error(
error
);

res
.status(500)
.send(
"Error"
);

}

}

);
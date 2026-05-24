import twilio
from "twilio";

export function verifyTwilio(
req:any,
res:any,
next:any
){

const signature=
req.headers[
"x-twilio-signature"
] as string;

const valid=
twilio.validateRequest(

process.env
.TWILIO_AUTH_TOKEN!,

signature,

process.env
.WEBHOOK_URL!,

req.body

);

if(
!valid
){

return res
.status(403)
.send(
"Forbidden"
);

}

next();

}
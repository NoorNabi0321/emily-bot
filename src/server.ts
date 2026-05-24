import express
from "express";

import dotenv
from "dotenv";

import {
 twilioRouter
}
from "./webhooks/twilio";

dotenv.config();

const app=
express();

app.use(
express.urlencoded(
{
extended:false
}
)
);

app.use(
express.json()
);

app.use(
"/webhook",
twilioRouter
);

app.get(
"/",
(req,res)=>{

res.send(
"Emily Bot API Online"
);

}
);

app.get(
"/health",
(req,res)=>{

res.send(
"Emily Bot Running"
);

}
);

const PORT=
process.env.PORT
||3000;

console.log(
"Server Starting..."
);

app.listen(
PORT,
()=>{

console.log(
`Emily Bot running on ${PORT}`
);

}
);
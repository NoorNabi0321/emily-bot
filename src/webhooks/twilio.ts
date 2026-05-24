import { Router } from "express";

export const twilioRouter = Router();

twilioRouter.post("/whatsapp", async (req, res) => {

  const from = req.body.From;
  const body = req.body.Body;

  console.log("Sender:", from);
  console.log("Message:", body);

  res.set("Content-Type", "text/xml");

  res.send(`
<Response>
<Message>Hello from Emily Bot 🚀</Message>
</Response>
`);

});
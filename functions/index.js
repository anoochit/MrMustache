/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started


const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const line = require("./utils/line.js");
const { logger } = require("firebase-functions");


setGlobalOptions({
  region: "asia-southeast1"
});


// schedule messaging
exports.schedule = onSchedule("*/5 * * * *", async (event) => {
  const groupId = `${process.env.GROUP_ID}`;
  await line.push(groupId, [{ type: "text", text: "tick :)" }])
  logger.log("groudId = " + groupId);
  logger.log("tick :)");
})

// reply message to group
exports.webhook = onRequest(async (req, res) => {
  if (req.method === "POST") {
    const events = req.body.events;
    for (const event of events) {
      switch (event.type) {
        case "message":
          if (event.message.type === "text") {
            logger.log("groupId = " + event.source.groupId);
            await line.push(event.source.groupId, [{ type: "text", text: "Hello!" }])
          }

          break;
      }
    }
  }
  res.send(req.method);

});

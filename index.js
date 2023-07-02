import { google } from "googleapis";
import cron from "node-cron";

import authorize from "./helpers/googleAuth/index.js";
import {
  fetchAllNewThreads,
  fetchSingleThread,
} from "./helpers/fetchThreads.js";
import sendReply from "./helpers/sendReply.js";
import addLabelToMail from "./helpers/labels.js";

const runApp = async () => {
  const auth = await authorize(); //authenticating the user locally
  const gmail = google.gmail({ version: "v1", auth });

  //cron job running every minute
  cron.schedule("* * * * *", async () => {
    //fetching all the new threads
    const gotThreads = await fetchAllNewThreads({
      gmail,
    });

    //checking if there is any new thread
    if (gotThreads) {
      //looping over all threads received
      for (const thread of gotThreads) {
        //fetching data of the single thread
        const singleThreadMessage = await fetchSingleThread({
          gmail,
          threadId: thread.id,
        });

        if (singleThreadMessage) {
          //sending the reply to the mail
          const sendMailData = await sendReply({
            gmail,
            threadId: singleThreadMessage.threadId,
            header: singleThreadMessage.payload.headers,
          });

          if (sendMailData) {
            console.log(`#2023183221347164 Reply has been sent successfully`);

            const labelAddedToMail = await addLabelToMail({
              gmail,
              labelName: "Auto Replied Mails",
              threadId: singleThreadMessage.threadId,
            });

            if (labelAddedToMail) {
              console.log(`#2023183224633360 Label Added Successfully`);
            }
          } else console.log(`#2023183221422460 Some Error occurred`);
        } else
          console.log(
            `#2023183221122212 Message sent by you or message already replied`
          );
      }
    } else console.log(`#202318322850821 No new mails received`);
  });
};

runApp();

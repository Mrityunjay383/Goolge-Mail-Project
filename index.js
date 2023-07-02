import { google } from "googleapis";
import cron from "node-cron";

import authorize from "./helpers/googleAuth/index.js";
import {
  fetchAllNewThreads,
  fetchSingleThread,
} from "./helpers/fetchThreads.js";

const runApp = async () => {
  const auth = await authorize(); //authenticating the user locally
  const gmail = google.gmail({ version: "v1", auth });

  //cron job running every minute
  cron.schedule("* * * * *", async () => {
    const currentTimeStampInMins = Math.floor(new Date().getTime() / 1000);

    //getting 1 minute before timestamp in mins
    const checkTimeStampInMins = currentTimeStampInMins - 60;

    const gotThreads = await fetchAllNewThreads({
      gmail,
      checkTimeStampInMins,
    });

    //checking if there is any new thread
    if (gotThreads && gotThreads.length > 0) {
      //looping over all threads received
      for (const thread of gotThreads) {
        //fetching data of the single thread
        const singleThread = await fetchSingleThread({
          gmail,
          threadId: thread.id,
        });

        //length 1 of the thread means that this thread have only one message
        if (singleThread.length === 1) {
        }

        console.log(`#2023183201546509 singleThread`, singleThread);
      }
    }
  });
};

runApp();

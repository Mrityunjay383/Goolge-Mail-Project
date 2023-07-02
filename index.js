import { google } from "googleapis";

import authorize from "./helpers/googleAuth/index.js";
import {
  fetchAllNewThreads,
  fetchSingleThread,
} from "./helpers/fetchThreads.js";

const runApp = async () => {
  const startTimeStamp = new Date().getTime();

  const auth = await authorize();
  const gmail = google.gmail({ version: "v1", auth });

  await fetchAllNewThreads({ gmail, startTimeStamp });
};

runApp();

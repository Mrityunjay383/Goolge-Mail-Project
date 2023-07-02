const fetchAllNewThreads = async ({ gmail }) => {
  //getting the current timestamp in mins
  const currentTimeStampInMins = Math.floor(new Date().getTime() / 1000);

  //getting 1 minute before timestamp to fetch all the threads received in the past 1 minute
  const checkTimeStampInMins = currentTimeStampInMins - 60;

  const res = await gmail.users.threads.list({
    userId: "me",
    q: `after:${checkTimeStampInMins}`, //for getting all the mails received after checkTimeStampInMins time
  });

  //if getting any new threads
  if (res.data.threads && res.data.threads.length > 0) {
    return res.data.threads;
  } else return null;
};

const fetchSingleThread = async ({ gmail, threadId }) => {
  const res = await gmail.users.threads.get({
    userId: "me",
    id: threadId,
  });

  //length 1 of the thread means that this thread have only one message
  //checking if the label SENT already not present, to eliminate the message sent by me
  if (
    res.data.messages.length === 1 &&
    res.data.messages[0].labelIds.indexOf("SENT") === -1
  ) {
    return res.data.messages[0];
  } else return null;
};

export { fetchAllNewThreads, fetchSingleThread };

const fetchAllNewThreads = async ({ gmail, checkTimeStampInMins }) => {
  const res = await gmail.users.threads.list({
    userId: "me",
    q: `after:${checkTimeStampInMins}`, //for getting all the mails received after a specific time
  });

  return res.data.threads;
};

const fetchSingleThread = async ({ gmail, threadId }) => {
  const res = await gmail.users.threads.get({
    userId: "me",
    id: threadId,
  });

  return res.data.messages;
};

export { fetchAllNewThreads, fetchSingleThread };

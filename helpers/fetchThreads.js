const fetchAllNewThreads = async ({ gmail, startTimeStamp }) => {
  const res = await gmail.users.threads.list({
    userId: "me",
    q: `after:${startTimeStamp}`, //getting all the mails received after our server starts
  });

  return res.data.threads;
};

const fetchSingleThread = async ({ gmail }) => {
  const res = await gmail.users.threads.get({
    userId: "me",
    id: "189155aaac576731",
  });

  console.log(`#2023183185435489 res`, res.data);
};

export { fetchAllNewThreads, fetchSingleThread };

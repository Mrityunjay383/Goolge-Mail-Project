const fetchLabels = async ({ gmail }) => {
  try {
    const res = await gmail.users.labels.list({
      userId: "me",
    });

    return res.data.labels;
  } catch (err) {
    console.log(err);
  }
};

const getLabelId = ({ allLabels, labelName }) => {
  //looping through all labels
  for (let label of allLabels) {
    if (label.name === labelName) {
      return label.id;
    }
  }
  return null;
};

const addLabel = async ({ gmail, labelId, threadId }) => {
  try {
    await gmail.users.threads.modify({
      userId: "me",
      id: threadId,
      requestBody: {
        addLabelIds: [labelId],
      },
    });

    return true;
  } catch (err) {
    console.log(`#2023183223835201 err`, err);
    return false;
  }
};

const createNewLabel = async ({ gmail, labelName }) => {
  try {
    const res = await gmail.users.labels.create({
      userId: "me",
      requestBody: {
        labelListVisibility: "labelShow",
        messageListVisibility: "show",
        name: labelName,
      },
    });

    return res.data.id;
  } catch (err) {
    console.log(`#202318323555153 err`, err);
    return null;
  }
};

const addLabelToMail = async ({ gmail, labelName, threadId }) => {
  try {
    //fetching all the labels exist
    const allLabels = await fetchLabels({ gmail });

    //checking if the label already present and getting its id
    const labelId = getLabelId({ allLabels, labelName });

    if (labelId) {
      const labelAddedSuccessfully = await addLabel({
        gmail,
        labelId,
        threadId,
      });
      if (labelAddedSuccessfully) {
        return true;
      }
    } else {
      //if label id is not already present, we need to create one and then add it
      const newLabelId = await createNewLabel({ gmail, labelName });

      if (newLabelId) {
        const labelAddedSuccessfully = await addLabel({
          gmail,
          labelId: newLabelId,
          threadId,
        });
        if (labelAddedSuccessfully) {
          return true;
        }
      }
    }
  } catch (err) {
    console.log(`#20231832343182 err`, err);
    return false;
  }
};

export default addLabelToMail;

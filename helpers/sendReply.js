const readHeader = ({ header }) => {
  let subject, from, to, ref, InReply;

  header.forEach((element) => {
    if (element.name === "Subject" || element.name === "subject") {
      subject = element.value;
    }

    //swapping the from and to fields to send a reply to same email
    if (element.name === "To" || element.name === "to") {
      from = element.value;
    }
    if (element.name === "From" || element.name === "from") {
      to = element.value;
    }

    if (element.name === "Message-ID" || element.name === "Message-Id") {
      ref = element.value;
      InReply = element.value;
    }
  });

  return { subject, from, to, ref, InReply };
};

const makeMailBody = async ({ ref, InReply, to, from, subject }) => {
  const messageParts = [
    'Content-Type: text/plain; charset="UTF-8"\n',
    "MIME-Version: 1.0\n",
    "Content-Transfer-Encoding: 7bit\n",
    `References:${ref}\n`,
    `In-Reply-To: ${InReply}\n`,
    `Subject: Re:${subject}\n`,
    `From: ${from}\n`,
    `To: ${to}\n`,
    "\n",
    "Thanks for dropping me a line! I just wanted to shoot you a quick message to let you know that I've received your email. Awesome to see you reaching out!\nI'm currently swamped with emails, but don't worry—I haven't forgotten about you. I'll do my best to get back to you as soon as I can. So, hang tight!\nThanks for your patience",
  ];
  const comMessage = messageParts.join("");

  // The body needs to be base64url encoded.
  return Buffer.from(comMessage)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const sendReply = async ({ gmail, header, threadId }) => {
  try {
    //getting important variables from the header of the received mail
    const headerParams = readHeader({ header });

    //forming raw mail
    const rawMail = await makeMailBody(headerParams);

    //sending message as a reply to the received message
    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: rawMail,
        threadId, //sending thread id to let gmail know this message is the part of the same thread
      },
    });

    return true;
  } catch (err) {
    console.log(`#202318321180205 err`, err);
    return false;
  }
};

export default sendReply;

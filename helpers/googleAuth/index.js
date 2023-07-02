import { promises as fs } from "fs";
import path from "path";
import process from "process";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";

// If modifying these scopes, delete token.json.
const SCOPES = ["https://mail.google.com/"];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "./helpers/googleAuth/token.json");
const CREDENTIALS_PATH = path.join(
  process.cwd(),
  "./helpers/googleAuth/credentials.json"
);

const loadSavedCredentialsIfExist = async () => {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
};

const saveCredentials = async (client) => {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
};

const authorize = async () => {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
};

// async function listLabels(auth) {
//   const gmail = google.gmail({ version: "v1", auth });
//   const res = await gmail.users.labels.list({
//     userId: "me",
//   });
//   const labels = res.data.labels;
//   if (!labels || labels.length === 0) {
//     console.log("No labels found.");
//     return;
//   }
//   console.log("Labels:");
//   labels.forEach((label) => {
//     console.log(`- ${label.name}`);
//   });
// }

export default authorize;

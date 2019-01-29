import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';
import util from 'util';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = 'token.json';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

export const authorize = async () => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI
  );

  try {
      const token = await readFile(TOKEN_PATH, 'utf8');
      oAuth2Client.setCredentials(JSON.parse(token));
      console.log('Token already exists');
      return oAuth2Client;
  }
  catch (err) {
      return await getAccessToken(oAuth2Client);
  }
}

const getInput = async (message) => {
  return new Promise((resolve) => {

      const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
      })

      rl.question(message, (data) => {
          rl.close()
          resolve(data)
      })

  })
}

const getAccessToken = async (oAuth2Client) => {
  const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
  });

  console.log('Authorize this app by visiting this url:', authUrl);

  const code = await getInput('Enter the code from that page here: ');

  try {
      const result = await oAuth2Client.getToken(code);
      const token = result.tokens;
      oAuth2Client.setCredentials(token);

      try {
          await writeFile(TOKEN_PATH, JSON.stringify(token));
          console.log('Token stored to', TOKEN_PATH);
          return oAuth2Client;
      }
      catch (err) {
          console.error(err)
          throw err
      }

  }
  catch (err) {
      console.error('Error retrieving access token', err)
      throw err
  }

}
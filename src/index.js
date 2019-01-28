import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';
import util from 'util';
import getUrls from 'get-urls';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = 'token.json';
const CREDENTIALS_PATH = 'credentials.json';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const setup = async () => {
    try {
        const content = await readFile(CREDENTIALS_PATH, 'utf8');
        let oAuth2Client = await authorize(JSON.parse(content));
        await listMessages(oAuth2Client);
    }
    catch (err) {
        console.log(err)
    }
}

const authorize = async (credentials) => {
    const { client_secret, client_id, redirect_uris } = credentials.installed;

    let oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

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

    let code = await getInput('Enter the code from that page here: ');

    try {
        let result = await oAuth2Client.getToken(code);
        console.log(result);
        let token = result.tokens;
        console.log('token', token);
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


// need to use full format to get message headers which contain sender data
const getSender = async (getMessagesPromise, messageId) => {
  try {
    const res = await getMessagesPromise({
      userId: 'me',
      id: messageId,
      format: 'full',
    });
      const headers = res.data.payload.headers;
      const sender_obj = headers.filter(header => header.name === 'From')[0];
      const sender = sender_obj.value;
      return sender;
  } catch (err) {
    console.log('error getting sender', err);
  }
}

// need to use raw format to get unsubscribe url
const getUrl = async (getMessagesPromise, messageId) => {
  try {
    const res = await getMessagesPromise({
      userId: 'me',
      id: messageId,
      format: 'raw',
    });
    const encodedData = res.data.raw;
    const msg_str = Buffer.from(encodedData, 'base64').toString();
    const urls = getUrls(msg_str);
    const unsubscribeLinks = [...urls].filter(url => url.toLowerCase().includes('unsubscribe'));
    return unsubscribeLinks;
  } catch (err) {
    console.log('error getting url', err)
  }
}

const listMessages = async (auth) => {
  const gmail = google.gmail({version: 'v1', auth});
  // promisify the gmail functions we need
  const listMessagesPromise = util.promisify(gmail.users.messages.list);
  const getMessagesPromise = util.promisify(gmail.users.messages.get);
  // gets list of message IDs
  try {
    const result = await listMessagesPromise({
      userId: 'me',
      q: 'unsubscribe',
    });

    const messageData = result.data.messages;
    if (messageData.length) {
      console.log('i got your message IDs!');
      // get message sender
      // TODO wrap in Promise.all 
      const resultList = [];
      await Promise.all(messageData.map(async (data) => {
        const sender = await getSender(getMessagesPromise, data.id);
        const unsubscribeUrl = await getUrl(getMessagesPromise, data.id);
        const result = { sender, unsubscribeUrl };
        resultList.push(result);
      }));
      console.log(resultList);

      // const sender = await getSender(getMessagesPromise, messageData[0].id);
      // const unsubscribeUrl = await getUrl(getMessagesPromise, messageData[0].id);
      // const result = { sender, unsubscribeUrl };
      // console.log(result);
    } else {
      console.log('No messages found.');
    }
  } catch (err) {
    console.log('no messages found', err);
  }
}

import { google } from 'googleapis';
import util from 'util';
import { filter, flow, uniqBy } from 'lodash/fp';

const NO_LIST_UNSUBSCRIBE = 'no list-unsubscribe';

const filterHeaders = (headers, name) => filter(header => header.name === name)(headers)[0];

const getUnsubscribeHeaderValues = (data, key) => {
  const value = filter(el => el.includes(key))(data)[0];
  switch (key) {
    case 'http':
      return value ? { link: value } : {};
    case 'mailto:':
      return value ? { email: value.replace(/mailto:/, '') } : {};
    default:
      return {};
  }
};

const formatUnsubscribeHeaderData = data => data.value.replace(/<|>/g, '').split(', ');

const parseListUnsubscribe = headers => {
  const unsubscribeHeader = filterHeaders(headers, 'List-Unsubscribe');
  if (unsubscribeHeader) {
    const data = formatUnsubscribeHeaderData(unsubscribeHeader);
    const link = getUnsubscribeHeaderValues(data, 'http');
    const email = getUnsubscribeHeaderValues(data, 'mailto:');
    return { ...link, ...email };
  }
};

const parseSender = headers => {
  const senderHeader = filterHeaders(headers, 'From');
  return senderHeader.value.split(' <')[0];
}

const getListUnsubscribe = async (getMessagesPromise, messageId) => {
  try {
    const res = await getMessagesPromise({
      userId: 'me',
      id: messageId,
      format: 'full',
    });
      const headers = res.data.payload.headers;
      const listUnsubscribe = parseListUnsubscribe(headers);
      if (listUnsubscribe) {
        const sender = parseSender(headers);
        return { sender, ...listUnsubscribe };
      }
      return NO_LIST_UNSUBSCRIBE;
  } catch (err) {
    console.log('error getting list unsubscribe', err);
  }
}

const cleanupResultList = resultList => flow(
  filter(result => result && result !== NO_LIST_UNSUBSCRIBE),
  uniqBy('sender'),
)(resultList);


export const getUnsubscribeList = async (auth) => {
  const gmail = google.gmail({version: 'v1', auth});
  // promisify the gmail functions we need because it's more fun than callbacks
  const listMessagesPromise = util.promisify(gmail.users.messages.list);
  const getMessagesPromise = util.promisify(gmail.users.messages.get);
  // gets list of message IDs
  try {
    const result = await listMessagesPromise({
      userId: 'me',
      q: 'list:',
      maxResults: 30,
    });
    const messageData = result.data.messages;
    if (messageData.length) {
      const resultList = await Promise.all(messageData.map(async (data) => {
        return getListUnsubscribe(getMessagesPromise, data.id);
      }));
      return cleanupResultList(resultList);
    } else {
      console.log('No messages found.');
    }
  } catch (err) {
    console.log('error getting messages', err);
  }
}

export const test = {
  cleanupResultList,
  parseListUnsubscribe,
  parseSender,
};
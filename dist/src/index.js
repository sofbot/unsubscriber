'use strict';

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _readline = require('readline');

var _readline2 = _interopRequireDefault(_readline);

var _googleapis = require('googleapis');

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _getUrls = require('get-urls');

var _getUrls2 = _interopRequireDefault(_getUrls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
var TOKEN_PATH = 'token.json';
var CREDENTIALS_PATH = 'credentials.json';

var readFile = _util2.default.promisify(_fs2.default.readFile);
var writeFile = _util2.default.promisify(_fs2.default.writeFile);

var setup = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var content, oAuth2Client;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return readFile(CREDENTIALS_PATH, 'utf8');

                    case 3:
                        content = _context.sent;
                        _context.next = 6;
                        return authorize(JSON.parse(content));

                    case 6:
                        oAuth2Client = _context.sent;
                        _context.next = 9;
                        return listMessages(oAuth2Client);

                    case 9:
                        _context.next = 14;
                        break;

                    case 11:
                        _context.prev = 11;
                        _context.t0 = _context['catch'](0);

                        console.log(_context.t0);

                    case 14:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[0, 11]]);
    }));

    return function setup() {
        return _ref.apply(this, arguments);
    };
}();

var authorize = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(credentials) {
        var _credentials$installe, client_secret, client_id, redirect_uris, oAuth2Client, token;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _credentials$installe = credentials.installed, client_secret = _credentials$installe.client_secret, client_id = _credentials$installe.client_id, redirect_uris = _credentials$installe.redirect_uris;
                        oAuth2Client = new _googleapis.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
                        _context2.prev = 2;
                        _context2.next = 5;
                        return readFile(TOKEN_PATH, 'utf8');

                    case 5:
                        token = _context2.sent;

                        oAuth2Client.setCredentials(JSON.parse(token));
                        console.log('Token already exists');
                        return _context2.abrupt('return', oAuth2Client);

                    case 11:
                        _context2.prev = 11;
                        _context2.t0 = _context2['catch'](2);
                        _context2.next = 15;
                        return getAccessToken(oAuth2Client);

                    case 15:
                        return _context2.abrupt('return', _context2.sent);

                    case 16:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined, [[2, 11]]);
    }));

    return function authorize(_x) {
        return _ref2.apply(this, arguments);
    };
}();

var getInput = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(message) {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        return _context3.abrupt('return', new Promise(function (resolve) {

                            var rl = _readline2.default.createInterface({
                                input: process.stdin,
                                output: process.stdout
                            });

                            rl.question(message, function (data) {
                                rl.close();
                                resolve(data);
                            });
                        }));

                    case 1:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function getInput(_x2) {
        return _ref3.apply(this, arguments);
    };
}();

var getAccessToken = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(oAuth2Client) {
        var authUrl, code, result, token;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        authUrl = oAuth2Client.generateAuthUrl({
                            access_type: 'offline',
                            scope: SCOPES
                        });


                        console.log('Authorize this app by visiting this url:', authUrl);

                        _context4.next = 4;
                        return getInput('Enter the code from that page here: ');

                    case 4:
                        code = _context4.sent;
                        _context4.prev = 5;
                        _context4.next = 8;
                        return oAuth2Client.getToken(code);

                    case 8:
                        result = _context4.sent;

                        console.log(result);
                        token = result.tokens;

                        console.log('token', token);
                        oAuth2Client.setCredentials(token);

                        _context4.prev = 13;
                        _context4.next = 16;
                        return writeFile(TOKEN_PATH, JSON.stringify(token));

                    case 16:
                        console.log('Token stored to', TOKEN_PATH);
                        return _context4.abrupt('return', oAuth2Client);

                    case 20:
                        _context4.prev = 20;
                        _context4.t0 = _context4['catch'](13);

                        console.error(_context4.t0);
                        throw _context4.t0;

                    case 24:
                        _context4.next = 30;
                        break;

                    case 26:
                        _context4.prev = 26;
                        _context4.t1 = _context4['catch'](5);

                        console.error('Error retrieving access token', _context4.t1);
                        throw _context4.t1;

                    case 30:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined, [[5, 26], [13, 20]]);
    }));

    return function getAccessToken(_x3) {
        return _ref4.apply(this, arguments);
    };
}();

// need to use full format to get message headers which contain sender data
var getSender = function () {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(getMessagesPromise, messageId) {
        var res, headers, sender_obj, sender;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        _context5.prev = 0;
                        _context5.next = 3;
                        return getMessagesPromise({
                            userId: 'me',
                            id: messageId,
                            format: 'full'
                        });

                    case 3:
                        res = _context5.sent;
                        headers = res.data.payload.headers;
                        sender_obj = headers.filter(function (header) {
                            return header.name === 'From';
                        })[0];
                        sender = sender_obj.value;
                        return _context5.abrupt('return', sender);

                    case 10:
                        _context5.prev = 10;
                        _context5.t0 = _context5['catch'](0);

                        console.log('error getting sender', _context5.t0);

                    case 13:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, undefined, [[0, 10]]);
    }));

    return function getSender(_x4, _x5) {
        return _ref5.apply(this, arguments);
    };
}();

// need to use raw format to get unsubscribe url
var getUrl = function () {
    var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(getMessagesPromise, messageId) {
        var res, encodedData, msg_str, urls, unsubscribeLinks;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        _context6.prev = 0;
                        _context6.next = 3;
                        return getMessagesPromise({
                            userId: 'me',
                            id: messageId,
                            format: 'raw'
                        });

                    case 3:
                        res = _context6.sent;
                        encodedData = res.data.raw;
                        msg_str = Buffer.from(encodedData, 'base64').toString();
                        urls = (0, _getUrls2.default)(msg_str);
                        unsubscribeLinks = [].concat((0, _toConsumableArray3.default)(urls)).filter(function (url) {
                            return url.toLowerCase().includes('unsubscribe');
                        });
                        return _context6.abrupt('return', unsubscribeLinks);

                    case 11:
                        _context6.prev = 11;
                        _context6.t0 = _context6['catch'](0);

                        console.log('error getting url', _context6.t0);

                    case 14:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, undefined, [[0, 11]]);
    }));

    return function getUrl(_x6, _x7) {
        return _ref6.apply(this, arguments);
    };
}();

var listMessages = function () {
    var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(auth) {
        var gmail, listMessagesPromise, getMessagesPromise, result, messageData, resultList;
        return _regenerator2.default.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        gmail = _googleapis.google.gmail({ version: 'v1', auth: auth });
                        // promisify the gmail functions we need

                        listMessagesPromise = _util2.default.promisify(gmail.users.messages.list);
                        getMessagesPromise = _util2.default.promisify(gmail.users.messages.get);
                        // gets list of message IDs

                        _context8.prev = 3;
                        _context8.next = 6;
                        return listMessagesPromise({
                            userId: 'me',
                            q: 'unsubscribe'
                        });

                    case 6:
                        result = _context8.sent;
                        messageData = result.data.messages;

                        if (!messageData.length) {
                            _context8.next = 16;
                            break;
                        }

                        console.log('i got your message IDs!');
                        // get message sender
                        // TODO wrap in Promise.all 
                        resultList = [];
                        _context8.next = 13;
                        return Promise.all(messageData.map(function () {
                            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(data) {
                                var sender, unsubscribeUrl, result;
                                return _regenerator2.default.wrap(function _callee7$(_context7) {
                                    while (1) {
                                        switch (_context7.prev = _context7.next) {
                                            case 0:
                                                _context7.next = 2;
                                                return getSender(getMessagesPromise, data.id);

                                            case 2:
                                                sender = _context7.sent;
                                                _context7.next = 5;
                                                return getUrl(getMessagesPromise, data.id);

                                            case 5:
                                                unsubscribeUrl = _context7.sent;
                                                result = { sender: sender, unsubscribeUrl: unsubscribeUrl };

                                                resultList.push(result);

                                            case 8:
                                            case 'end':
                                                return _context7.stop();
                                        }
                                    }
                                }, _callee7, undefined);
                            }));

                            return function (_x9) {
                                return _ref8.apply(this, arguments);
                            };
                        }()));

                    case 13:
                        console.log(resultList);

                        // const sender = await getSender(getMessagesPromise, messageData[0].id);
                        // const unsubscribeUrl = await getUrl(getMessagesPromise, messageData[0].id);
                        // const result = { sender, unsubscribeUrl };
                        // console.log(result);
                        _context8.next = 17;
                        break;

                    case 16:
                        console.log('No messages found.');

                    case 17:
                        _context8.next = 22;
                        break;

                    case 19:
                        _context8.prev = 19;
                        _context8.t0 = _context8['catch'](3);

                        console.log('no messages found', _context8.t0);

                    case 22:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, undefined, [[3, 19]]);
    }));

    return function listMessages(_x8) {
        return _ref7.apply(this, arguments);
    };
}();

// const listMessages = async (auth) => {
//   const gmail = google.gmail({version: 'v1', auth});
//   // gets list of message IDs 
//   gmail.users.messages.list({
//     userId: 'me',
//     q: 'unsubscribe',
//   }, (err, res) => {
//     if (err) return console.log('The API returned an error: ' + err);
//     const messages = res.data.messages;
//     if (messages.length) {
//       console.log('messages:');
//       console.log(messages.length);
//         // get message body
//         gmail.users.messages.get({
//           userId: 'me',
//           id: messages[1].id,
//           format: 'full',
//         }, (err, res) => {
//           if (err) return console.log('the API returned an error: ' + err);
//           const sender = getSender(res, err);
//           console.log(sender);
//           // const encodedData = res.data.payload.body.data;
//           // const msg_str = Buffer.from(encodedData, 'base64').toString();
//           // const headers = res.data.payload.headers;
//           // const from_obj = headers.filter(header => header.name === 'From');
//           // console.log(from_obj);
//           // const from = from_obj[0].value;

//           // const url = parseUrl(res);

//           // const result = { from, url };
//           // console.log(result);

//         });
//         console.log(sender);

//   //       await Promise.all(messages.map(async (message) => {
//   //         const sender = await getSender(gmail, message.id);
//   //         console.log(sender);
//   //       }));

//   //     // messages.forEach((message) => {
//   //     //   // get message body
//   //     //   const sender = await getSender(gmail, message.id);
//   //     //   console.log(sender);
//   //     //   // const unsubscribeLink = getLink(gmail, message.id);
//   //     //   // const result = { sender, unsubscribeLink };
//   //     //   // console.log(result);
//   //     // })

//     } else {
//       console.log('No messages found.');
//     }
//   });
// }


// Main

setup();

// import fs from 'fs';
// import readline from 'readline';
// import { google } from 'googleapis';
// import getUrls from 'get-urls';
// import { uniq } from 'lodash/fp';

// // If modifying these scopes, delete token.json.
// const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// // The file token.json stores the user's access and refresh tokens, and is
// // created automatically when the authorization flow completes for the first
// // time.
// const TOKEN_PATH = 'token.json';

// // Load client secrets from a local file.
// fs.readFile('credentials.json', async (err, content) => {
//   if (err) return console.log('Error loading client secret file:', err);
//   // Authorize a client with credentials, then call the Gmail API.
//   // authorize(JSON.parse(content), listMessages);
//   const auth = await authorize(JSON.parse(content));
//   listMessages(auth);
// });

// /**
//  * Create an OAuth2 client with the given credentials, and then execute the
//  * given callback function.
//  * @param {Object} credentials The authorization client credentials.
//  * @param {function} callback The callback to call with the authorized client.
//  */
// export const authorize = async (credentials, callback) => {
//   const {client_secret, client_id, redirect_uris} = credentials.installed;
//   const oAuth2Client = new google.auth.OAuth2(
//       client_id, client_secret, redirect_uris[0]);

//   // Check if we have previously stored a token.
//   fs.readFile(TOKEN_PATH, (err, token) => {
//     if (err) return getNewToken(oAuth2Client, callback);
//     oAuth2Client.setCredentials(JSON.parse(token));
//     callback(oAuth2Client);
//   });
// }

// /**
//  * Get and store new token after prompting for user authorization, and then
//  * execute the given callback with the authorized OAuth2 client.
//  * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
//  * @param {getEventsCallback} callback The callback for the authorized client.
//  */
// const getNewToken = async (oAuth2Client, callback) => {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES,
//   });
//   console.log('Authorize this app by visiting this url:', authUrl);
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//   rl.question('Enter the code from that page here: ', (code) => {
//     rl.close();
//     oAuth2Client.getToken(code, (err, token) => {
//       if (err) return console.error('Error retrieving access token', err);
//       oAuth2Client.setCredentials(token);
//       // Store the token to disk for later program executions
//       fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
//         if (err) return console.error(err);
//         console.log('Token stored to', TOKEN_PATH);
//       });
//       callback(oAuth2Client);
//     });
//   });
// }

// // headers are only returned in a full query
// const getSender = (err, res) => {
//   if (err) return console.log('the API returned an error: ' + err);
//   const headers = res.data.payload.headers;
//   const sender_obj = headers.filter(header => header.name === 'From')[0];
//   const sender = sender_obj.value;
//   console.log(sender);
//   return sender;
// }

// const parseUrl = res => {
//   const encodedData = res.data.raw;
//   const msg_str = Buffer.from(encodedData, 'base64').toString();
//   const urls = getUrls(msg_str);
//   const unsubscribeLinks = [...urls].filter(url => url.toLowerCase().includes('unsubscribe'));
//   return unsubscribeLinks
// }

// // parse link from raw query
// const getLink = (gmail, messageId) => {
//   return gmail.users.messages.get({
//     userId: 'me',
//     id: messageId,
//     format: 'raw',
//   }, (err, res) => {
//     if (err) return console.log('the API returned an error: ' + err);
//     const url = parseUrl(res);
//     return url;
//   })
// }

// /**
//  * gets the messages in the user's account.
//  *
//  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
//  */

// const listMessages = async (auth) => {
//   const gmail = google.gmail({version: 'v1', auth});
//   // gets list of message IDs 
//   gmail.users.messages.list({
//     userId: 'me',
//     q: 'unsubscribe',
//   }, (err, res) => {
//     if (err) return console.log('The API returned an error: ' + err);
//     const messages = res.data.messages;
//     if (messages.length) {
//       console.log('messages:');
//       console.log(messages.length);
//         // get message body
//         gmail.users.messages.get({
//           userId: 'me',
//           id: messages[1].id,
//           format: 'full',
//         }, (err, res) => {
//           if (err) return console.log('the API returned an error: ' + err);
//           const sender = getSender(res, err);
//           console.log(sender);
//           // const encodedData = res.data.payload.body.data;
//           // const msg_str = Buffer.from(encodedData, 'base64').toString();
//           // const headers = res.data.payload.headers;
//           // const from_obj = headers.filter(header => header.name === 'From');
//           // console.log(from_obj);
//           // const from = from_obj[0].value;

//           // const url = parseUrl(res);

//           // const result = { from, url };
//           // console.log(result);

//         });
//         console.log(sender);

//   //       await Promise.all(messages.map(async (message) => {
//   //         const sender = await getSender(gmail, message.id);
//   //         console.log(sender);
//   //       }));

//   //     // messages.forEach((message) => {
//   //     //   // get message body
//   //     //   const sender = await getSender(gmail, message.id);
//   //     //   console.log(sender);
//   //     //   // const unsubscribeLink = getLink(gmail, message.id);
//   //     //   // const result = { sender, unsubscribeLink };
//   //     //   // console.log(result);
//   //     // })

//     } else {
//       console.log('No messages found.');
//     }
//   });
// }
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _auth = require('./auth');

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var setup = exports.setup = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var oAuth2Client, data;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _auth.authorize)();

          case 3:
            oAuth2Client = _context.sent;
            _context.next = 6;
            return (0, _util.getUnsubscribeList)(oAuth2Client);

          case 6:
            data = _context.sent;

            console.log(_chalk2.default.bold.green('unsubscribe-able lists:'));
            data.map(function (result) {
              var sender = result.sender,
                  email = result.email,
                  link = result.link;

              console.log(_chalk2.default.bold('' + sender) + ':' + '\n' + '\t' + _chalk2.default.red('' + (email ? 'email: ' + email : '')) + '\n' + '\t' + _chalk2.default.red('' + (link ? 'link: ' + link : '')));
            });
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

setup();
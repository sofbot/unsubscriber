import { expect } from 'chai';
import { test } from '../../src/util';

const {
  cleanupResultList,
  parseListUnsubscribe,
  parseSender
} = test;

const HEADERS = [
  {
    name: 'From',
    value: 'sofbot <me@sofiachen.com>',
  },
  { 
    name: 'List-Unsubscribe',
    value:  '<http://dankmemes.com>, <mailto:sunshine@allday.com>',
  }
];

describe('getUnsubscribeList', () => {
  describe('parseListUnsubscribe', () => {
    it('should return a properly formatted object with email and link from email headers', () => {
      const expectedResult = { link: 'http://dankmemes.com', email: 'sunshine@allday.com' };
      expect(parseListUnsubscribe(HEADERS)).to.eql(expectedResult);
    });
    it('should return just an email object if link is missing and vice versa', () => {
      const linkOnlyHeader = [{ name: 'List-Unsubscribe', value: '<https://dankermemes.com>'}];
      const expectedLinkResult = { link: 'https://dankermemes.com' }
      expect(parseListUnsubscribe(linkOnlyHeader)).to.eql(expectedLinkResult);

      const emailOnlyHeader = [{ name: 'List-Unsubscribe', value: '<mailto:sunshine@allday.com>' }];
      const expectedEmailResult = { email: 'sunshine@allday.com' }
      expect(parseListUnsubscribe(emailOnlyHeader)).to.eql(expectedEmailResult);
    });
    it('should return undefined if headers are missing List-Unsubscribe object', () => {
      const incompleteHeaders = [ { name: 'Other-Header', value: 'popcicles' } ];
      expect(parseListUnsubscribe(incompleteHeaders)).to.eql(undefined);
    });
  })

  describe('parseSender', () => {
    it('should return a properly formatted sender value', () => {
      expect(parseSender(HEADERS)).to.equal('sofbot');
    });
  });

  describe('cleanupResultList', () => {
    const messyResultList = [
      { sender: 'sofbot', email: 'me@sofiachen.com', link: 'http://sofiachen.com' },
      { sender: 'sofbot', email: 'me@sofiachen.com', link: 'http://sofiachen.com' },
      { sender: 'leti', email: 'leti@sweet.com', link: 'http://leti.com' },
      'no list-unsubscribe',
    ];
    const expectedResult = [
      { sender: 'sofbot', email: 'me@sofiachen.com', link: 'http://sofiachen.com' },
      { sender: 'leti', email: 'leti@sweet.com', link: 'http://leti.com' },
    ]
    expect(cleanupResultList(messyResultList)).to.eql(expectedResult);
  })
})
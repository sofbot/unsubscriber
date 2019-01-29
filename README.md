# Unsubscriber

A simple command line tool to unsubscribe from mailing lists more efficiently. Goodbye spam!

Unsubscriber pulls email data from your gmail API and displays a list of miling list senders along with a link and/or email to unsubscribe from their annoying emails. Currently relies upon the 'List-Unsubscribe' header to get unsubscribe links and emails.

from the root directory, run `npm start` to get your unsubscribe list. run `npm test` to run test suite

# Specs / APIs 
* gmail API v1
* node v8.12.0
* npm 6.4.1
* mocha/chai


# Future Goals
* create an easy to navigate frontend
* add functionality for mailers that do not include a list-unsubscribe header
* allow user to get more results (currently pulls first 30 campaigns)
* add integration tests
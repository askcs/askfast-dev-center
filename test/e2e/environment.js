'use strict';
module.exports = {
  ciUsername: (process.env.CI_USERNAME || 'vincent'),
  ciPass: (process.env.CI_PASS || 'askask'),
  ciBadPass: (process.env.CI_BADPASS || 'dumm'),
  ciUrl: (process.env.CI_URL || 'http://dev.ask-fast.com')
};
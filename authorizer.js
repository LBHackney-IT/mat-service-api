/* eslint-disable @typescript-eslint/no-var-requires */
const authorizer = require('node-lambda-authorizer')({
  jwtSecret: process.env.JWT_SECRET,
  allowedGroups: process.env.ALLOWED_GROUPS.split(','),
  debug: 'true',
});

exports.handler = authorizer.handler;

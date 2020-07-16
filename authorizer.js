const authorizer = require('node-lambda-authorizer')({
  jwtSecret: process.env.JWTSecret,
  allowedGroups: process.env.ALLOWEDGROUP.split(','),
});

exports.handler = authorizer.handler;

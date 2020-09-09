const nextEnv = require('next-env');
const dotenvLoad = require('dotenv-load');

dotenvLoad();

const withNextEnv = nextEnv();

module.exports = withNextEnv({
  target: 'serverless',
  webpack: (config, { webpack }) => {
    config.plugins.push(new webpack.IgnorePlugin(/^pg-native$/));
    return config;
  },
});

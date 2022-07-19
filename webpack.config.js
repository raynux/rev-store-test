const dotenv = require('dotenv')
const env = dotenv.config().parsed

plugins: [
  new webpack.DefinePlugin({
    'process.env': JSON.stringify(env),
  }),
]

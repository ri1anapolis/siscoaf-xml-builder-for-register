const { override } = require('customize-cra')
const cspHtmlWebpackPlugin = require('csp-html-webpack-plugin')

const cspConfigPolicy = {
  'script-src': ["'self'", 'https:', "'unsafe-eval'", "'unsafe-inline'"],
}

function addCspHtmlWebpackPlugin(config) {
  if (process.env.NODE_ENV === 'production') {
    config.plugins.push(new cspHtmlWebpackPlugin(cspConfigPolicy))
  }

  return config
}

module.exports = {
  webpack: override(addCspHtmlWebpackPlugin),
}

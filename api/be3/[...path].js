const { proxyRequest } = require('../_proxy');

module.exports = function handler(request, response) {
  return proxyRequest(request, response, {
    envName: 'BE3_PROXY_TARGET_URL',
    prefixes: ['/api/be3', '/be3'],
  });
};

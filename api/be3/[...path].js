const { proxyRequest } = require('../_proxy');

module.exports = function handler(request, response) {
  return proxyRequest(request, response, {
    envName: 'BE3_PROXY_TARGET_URL',
    prefix: '/api/be3',
  });
};

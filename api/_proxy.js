const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'content-encoding',
  'content-length',
  'host',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]);

function buildHeaders(sourceHeaders) {
  const headers = new Headers();

  for (const [name, value] of Object.entries(sourceHeaders)) {
    const normalizedName = name.toLowerCase();

    if (HOP_BY_HOP_HEADERS.has(normalizedName) || value === undefined) {
      continue;
    }

    headers.set(name, Array.isArray(value) ? value.join(', ') : value);
  }

  return headers;
}

function requireProxyTarget(envName) {
  const rawTarget = process.env[envName]?.trim();

  if (!rawTarget) {
    throw new Error(`${envName} is required.`);
  }

  const target = new URL(rawTarget);

  if (!['http:', 'https:'].includes(target.protocol)) {
    throw new Error(`${envName} must use an http or https URL.`);
  }

  return target;
}

function normalizeProxyPrefixes({ prefix, prefixes }) {
  if (Array.isArray(prefixes)) {
    return prefixes;
  }

  if (prefix) {
    return [prefix];
  }

  return [];
}

function stripProxyPrefix(pathname, prefixes) {
  const matchedPrefix = prefixes.find((prefix) => {
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });

  if (!matchedPrefix) {
    return pathname;
  }

  return pathname.slice(matchedPrefix.length) || '/';
}

function buildTargetPathFromQuery(incomingUrl, pathQueryParam) {
  if (!pathQueryParam) {
    return null;
  }

  const pathFromQuery = incomingUrl.searchParams.get(pathQueryParam);

  if (!pathFromQuery) {
    return '/';
  }

  incomingUrl.searchParams.delete(pathQueryParam);

  return pathFromQuery.startsWith('/') ? pathFromQuery : `/${pathFromQuery}`;
}

function buildTargetUrl(requestUrl, options, targetBase) {
  const incomingUrl = new URL(requestUrl, 'https://vercel.local');
  const pathname =
    buildTargetPathFromQuery(incomingUrl, options.pathQueryParam) ??
    stripProxyPrefix(incomingUrl.pathname, normalizeProxyPrefixes(options));

  const targetUrl = new URL(pathname || '/', targetBase);
  targetUrl.search = incomingUrl.searchParams.toString();

  return targetUrl;
}

async function proxyRequest(request, response, { envName, pathQueryParam, prefix, prefixes }) {
  let targetUrl;

  try {
    targetUrl = buildTargetUrl(
      request.url,
      { pathQueryParam, prefix, prefixes },
      requireProxyTarget(envName),
    );
  } catch (error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'application/json; charset=utf-8');
    response.end(JSON.stringify({ message: error.message }));
    return;
  }

  try {
    const upstreamResponse = await fetch(targetUrl, {
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request,
      duplex: ['GET', 'HEAD'].includes(request.method) ? undefined : 'half',
      headers: buildHeaders(request.headers),
      method: request.method,
      redirect: 'manual',
    });

    response.statusCode = upstreamResponse.status;

    upstreamResponse.headers.forEach((value, name) => {
      if (!HOP_BY_HOP_HEADERS.has(name.toLowerCase())) {
        response.setHeader(name, value);
      }
    });

    if (!upstreamResponse.body) {
      response.end();
      return;
    }

    const reader = upstreamResponse.body.getReader();

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        response.end();
        return;
      }

      response.write(Buffer.from(value));
    }
  } catch {
    response.statusCode = 502;
    response.setHeader('content-type', 'application/json; charset=utf-8');
    response.end(JSON.stringify({ message: 'Backend proxy request failed.' }));
  }
}

module.exports = {
  buildTargetUrl,
  proxyRequest,
};

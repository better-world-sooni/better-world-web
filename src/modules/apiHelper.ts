import fetch from 'isomorphic-unfetch'
import { getJwt } from './cookieHelper'
import cookies from 'next-cookies'
import webviewPostMessage from './webviewPostMessage'

export function apiHelper(url, method = 'GET', body = null) {
    return http(url, method, body, {})
}
export function apiHelperPure(url, method = 'GET', body = null, headers) {
  return httpPure(url, method, body, headers)
}

export function apiHelperWithJwtFromContext(ctx, url, method = 'GET', body = null) {
  const jwt = ctx?.req?.headers?.webviewcookie || cookies(ctx).jwt;
  return http(url, method, body, {
    Authorization: 'Bearer ' + jwt
  })
}

export function apiHelperWithToken(url, method = 'GET', body = null) {
  const jwt = getJwt()
  return http(url, method, body, {
    Authorization: 'Bearer ' + jwt
  })
}

function http(urlObject: any, method: string, body: Object, headers: Object){
  let header = null
  if (body) {
    header = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify(body),
    }
  } else {
    header = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
    }
  }

  return fetch(getUriByApi(urlObject), header)
    .then((res) => res.json())
    .then(
      (result) => {
        webviewPostMessage({action: "http", params: { urlObject, method, body, headers}, result})
        return result
      },
      (error) => ({
        success: false,
        error,
      })
    )
}
function httpPure(url: string, method: string, body: Object, headers: Object){
  console.log(body)
  alert(body)
  let header = null
  if (body) {
    header = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: body
    }
  } else {
    header = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
    }
  }
  return fetch(url, header)
}

const keyWithScope = (key, scope?) => {
  return scope ? `${scope}/${key}` : key;
};

const getUriByApi = (api, scope?) => {
  if (typeof api === 'object') {
    return keyWithScope(api.url, scope);
  } else if (typeof api === 'string') {
    return keyWithScope(api, scope);
  }
};

const getKeyByApi = (api, scope?) => {
  if (typeof api === 'function') {
    return keyWithScope(api._apiKey, scope);
  } else if (typeof api === 'object') {
    return keyWithScope(api.key, scope);
  } else if (typeof api === 'string') {
    return keyWithScope(api, scope);
  }
};
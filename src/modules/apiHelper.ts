import fetch from 'isomorphic-unfetch'
import { getJwt } from './cookieHelper'
import cookies from 'next-cookies'

export function apiHelper(url, method = 'GET', body = null) {
    return http(url, method, body, {})
}
export function apiHelperPure(url, method = 'GET', body = null, headers) {
  return httpPure(url, method, body, headers)
}

export function apiHelperWithJwtFromContext(context, url, method = 'GET', body = null) {
  const {jwt} = cookies(context) 
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

function http(url: string, method: string, body: Object, headers: Object){
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

  return fetch(url, header)
    .then((res) => res.json())
    .then(
      (result) => {
        return result
      },
      (error) => ({
        success: false,
        error,
      })
    )
}
function httpPure(url: string, method: string, body: Object, headers: Object){
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
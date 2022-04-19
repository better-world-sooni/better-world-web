import urljoin from 'url-join'
import getConfig from 'next/config'
import querystring from 'querystring'
import {isEmpty, omitBy, isNil} from 'lodash'
const { publicRuntimeConfig } = getConfig()

export const SERVER_URL = publicRuntimeConfig.CONF_SERVER_URL || 'https://api.gomz.io'
// SERVER_URL을 바꾸고 싶으면, 위에 주소를 직접 수장하지 말고 .env.local 파일에 CONF_SERVER_URL를 추가해 주세요


const apiV1 = (path) => urljoin(`${SERVER_URL}/api/v1`, path)

// null 일경우에는 파라메터 제거
export const urlParams = (obj, nullable?) => {
  if (nullable) {
    return isEmpty(obj) ? '' : '?' + querystring.stringify(obj)
  }
  const nilRemoved = omitBy(obj, isNil)
  if (isEmpty(nilRemoved)) {
    return ''
  }
  return '?' + querystring.stringify(nilRemoved)
}

const apis = {
  land: {
      get: (x, y) => apiV1(`/land${urlParams({
        x,
        y,
      })}`),
      getAll: () => apiV1('land/all'),
  },
  auth: {
    kaikas: {
      verification: () => apiV1('/auth/kaikas/verification'),
      nonce: () => apiV1(`/auth/kaikas/nonce`),
    },
    klip: {
      verify: () =>apiV1('/auth/klip/verification')
    },
    email: {
      _: () => apiV1('/auth/email')
    },
    user: {
      _: () => apiV1('/auth/user')
    }
  },
  profile: {
    klaytnAddress: (klaytnAddress) => apiV1(`/profile/${klaytnAddress}`)
  },
  nftProfile: {
    contractAddressAndTokenId: (contractAddress, tokenId) => apiV1(`/nft_profile/${contractAddress}/${tokenId}`)
  },
  nft_collection: {
    contractAddress: (contractAddress) => apiV1(`/nft_collection/${contractAddress}`)
  },
  comment: {
    post: (postId) => apiV1(`/post/${postId}`),
    comment: (commentId) => apiV1(`/post/${commentId}`)
  },
  like: {
    post: (postId) => apiV1(`/post/${postId}`),
    comment: (commentId) => apiV1(`/post/${commentId}`)
  },
  post: {
    _: () => apiV1(`/post`)
  },
  presignedUrl: {
    _: () => apiV1(`/presigned_url`)
  },
}

export default apis

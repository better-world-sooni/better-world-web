import urljoin from "url-join";
import getConfig from "next/config";
import querystring from "querystring";
import { isEmpty, omitBy, isNil } from "lodash";
const { publicRuntimeConfig } = getConfig();

export const SERVER_URL = publicRuntimeConfig.CONF_SERVER_URL || "https://api.betterworldapp.io";
// SERVER_URL을 바꾸고 싶으면, 위에 주소를 직접 수장하지 말고 .env.local 파일에 CONF_SERVER_URL를 추가해 주세요

const apiV1 = (path) => {
  return { url: urljoin(`${SERVER_URL}/api/v1`, path) };
};

// null 일경우에는 파라메터 제거
export const urlParams = (obj, nullable?) => {
  if (nullable) {
    return isEmpty(obj) ? "" : "?" + querystring.stringify(obj);
  }
  const nilRemoved = omitBy(obj, isNil);
  if (isEmpty(nilRemoved)) {
    return "";
  }
  return "?" + querystring.stringify(nilRemoved);
};

const apis = {
  auth: {
    kaikas: {
      verification: () => apiV1("/auth/kaikas/verification"),
      nonce: () => apiV1(`/auth/kaikas/nonce`),
    },
    klip: {
      verify: () => apiV1("/auth/klip/verification"),
    },
    password: {
      _: () => apiV1("/auth/password"),
    },
    user: {
      _: () => apiV1("/auth/user"),
    },
    jwt: {
      _: () => apiV1("/auth/jwt"),
      loginQr: () => apiV1("/auth/jwt/qr/create"),
    },
  },
  profile: {
    klaytnAddress: (klaytnAddress) => apiV1(`/profile/${klaytnAddress}`),
    _: () => apiV1(`/profile`),
  },
  search: {
    nft: (keyword) => apiV1(`/search/nft/${keyword}`),
  },
  nft: {
    contractAddressAndTokenId: (contractAddress, tokenId) => apiV1(`/nft/${contractAddress}/${tokenId}`),
    _: () => apiV1(`/nft`),
  },
  follow: {
    contractAddressAndTokenId: (contractAddress, tokenId) => apiV1(`/follow/${contractAddress}/${tokenId}`),
    contractAddress: (contractAddress) => apiV1(`/follow/${contractAddress}`),
  },
  nft_collection: {
    contractAddress: {
      _: (contractAddress) => apiV1(`/nft_collection/${contractAddress}`),
      profile: (contractAddress) => apiV1(`/nft_collection/${contractAddress}/profile`),
    },
  },
  comment: {
    post: (postId) => apiV1(`/comment/post/${postId}`),
    comment: (commentId) => apiV1(`/comment/comment/${commentId}`),
  },
  like: {
    post: (postId) => apiV1(`/like/post/${postId}`),
    comment: (commentId) => apiV1(`/like/comment/${commentId}`),
  },
  post: {
    _: () => apiV1(`/post`),
    postId: {
      _: (postId) => apiV1(`/post/${postId}`),
      comment: (postId) => apiV1(`/post/${postId}/comment`),
    },
  },
  feed: {
    _: () => apiV1(`/feed`),
  },
  presignedUrl: {
    _: () => apiV1(`/presigned_url`),
  },
  chat: {
    chatRoom: {
      all: () => apiV1(`chat/room/all`),
      contractAddressAndTokenId: (contractAddress, tokenId) => apiV1(`/chat/room/${contractAddress}/${tokenId}`),
      roomId: (roomId) => apiV1(`/chat/room/${roomId}`),
    },
  },
  admin: {
    user: {
      list: (page_size, offset, search_key) => apiV1(`/admin/user/list${urlParams({ page_size, offset, search_key })}`),
      _: () => apiV1(`/admin/user`),
      setPrivilege: (address, superPrivilege) => apiV1(`/admin/user/super_privilege${urlParams({ address, superPrivilege })}`),
    },
    events: {
      list: (page_size, offset, search_key) => apiV1(`/admin/event/list${urlParams({ page_size, offset, search_key })}`),
    },
    collections: {
      list: (page_size, offset, search_key) => apiV1(`/admin/nft_collection/list${urlParams({ page_size, offset, search_key })}`),
      _: () => apiV1(`/admin/nft_collection`),
    },
    post: {
      list: (page_size, offset, search_key) => apiV1(`/admin/event/list${urlParams({ page_size, offset, search_key })}`),
      _: () => apiV1(`/admin/post`),
    },
    comment: {
      _: () => apiV1(`/admin/comment`),
    },
  },
};

const mapFunctionToPath = (data, path = []) => {
  data &&
    Object.entries(data).map(([key, v]) => {
      if (typeof v === "function") {
        const apiKey = [...path, key].join(".");
        data[key] = (...args) => ({ ...v(...args), key: apiKey });
        Object.defineProperty(data[key], "_apiKey", { value: apiKey });
      } else if (typeof v === "object") {
        mapFunctionToPath(v, [...path, key]);
      }
    });
};
(function () {
  mapFunctionToPath(apis, ["apis"]);
})();

export default apis;

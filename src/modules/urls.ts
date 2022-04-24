export const urls = {
    index: '/',
    home: '/home',
    feed: '/feed',
    post: {
        index: () => `/post`,
        postId: (postId, section = "#") => `/post/${postId}${section}`,
        admin: {
            contractAddress:  (contractAddress) => {
                return `/post/admin/${contractAddress}`
            }
        }
    },
    onboarding: {
        klaytnAddress: (klaytnAddress) => `/onboarding/${klaytnAddress}`
    },
    nftProfile: {
        contractAddressAndTokenId: (contractAddress, tokenId) => {
            return `/nft-profile/${contractAddress}/${tokenId}`
        }
    },
    chat: {
        inbox: '/chat/inbox',
        room: (roomId) => `/chat/${roomId}`
    },
    gomzSpace: '/gomz-space',
    nftCollection: {
        contractAddress: (contractAddress) => {
            return `/nft-collection/${contractAddress}`
        }
    }
}
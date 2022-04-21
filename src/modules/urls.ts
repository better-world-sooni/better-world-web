export const urls = {
    index: '/',
    home: '/home',
    feed: '/feed',
    post: {
        index: () => `/post`,
        postId: (postId, section = "#") => `/post/${postId}${section}`
    },
    onboarding: {
        klaytnAddress: (klaytnAddress) => `/onboarding/${klaytnAddress}`
    },
    nftProfile: {
        contractAddressAndTokenId: (contractAddress, tokenId) => {
            return `/nft-profile/${contractAddress}/${tokenId}`
        }
    },
    chat: '/chat',
    gomzSpace: '/gomz-space',
    nftCollection: {
        contractAddress: (contractAddress) => {
            return `/nft-collection/${contractAddress}`
        }
    }
}
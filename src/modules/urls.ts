export const urls = {
    index: '/',
    home: '/home',
    feed: '/feed',
    post: {
        postId: (postId) => `/post/${postId}`
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
export const urls = {
    index: '/',
    home: '/home',
    feed: '/feed',
    profile: {
        klaytnAddress: (klaytnAddress) => {
            return `/profile/${klaytnAddress}`
        },
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
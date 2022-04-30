export const urls = {
    index: () => '/',
    home: () => '/home',
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
        index: () => `/onboarding`
    },
    nftProfile: {
        contractAddressAndTokenId: (contractAddress, tokenId) => {
            return `/nft-profile/${contractAddress}/${tokenId}`
        },
        index: () => '/nft-profile'
    },
    chat: {
        index: () => '/chat',
        room: (roomId) => `/chat/${roomId}`
    },
    gomzSpace: '/gomz-space',
    nftCollection: {
        contractAddress: (contractAddress) => {
            return `/nft-collection/${contractAddress}`
        }
    }
}
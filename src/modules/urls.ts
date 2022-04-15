export const urls = {
    home: '/home',
    forum: '/forum',
    profile: '/profile',
    chat: '/chat',
    gomzSpace: '/gomz-space',
    collection: {
        contractAddress: (contractAddress) => {
            return `/nft-collection/${contractAddress}`
        }
    }
}
export const urls = {
    home: '/home',
    forum: '/forum',
    gomzSpace: '/gomz-space',
    collection: {
        contractAddress: (contractAddress) => {
            return `/nft-collection/${contractAddress}`
        }
    }
}
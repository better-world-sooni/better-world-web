export const urls = {
    home: '/home',
    gomzSpace: '/gomz-space',
    collection: {
        contractAddress: (contractAddress) => {
            return `/nft-collection/${contractAddress}`
        }
    }
}
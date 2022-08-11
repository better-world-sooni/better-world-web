import { resizeImageUri } from "./uriUtils"

export function getNftProfileImage(nft, width=null, height= null){
    if(!nft) return null
    if(nft.image_uri){
        if(width && height){
            return resizeImageUri(nft.image_uri, width, height)
        }
        return nft.image_uri
    }
    return nft?.nft_metadatum?.image_uri
}

export function getNftCollectionProfileImage(nftCollection, width=null, height= null){
    if(width && height){
        return resizeImageUri(nftCollection?.image_uri, width, height)
    }
    return nftCollection?.image_uri
}

export function getNftName(nft){
    if(!nft) return null
    return nft?.name || nft?.nft_metadatum.name
}
export function getNftStory(nft){
    if(!nft) return null
    return nft.story || nft.about
}

export function truncateAddress(fullStr, strLen = 12, separator = '...') {
    if (fullStr.length <= strLen) return fullStr;
  
    var sepLen = separator.length,
      charsToShow = strLen - sepLen,
      frontChars = Math.ceil(charsToShow / 2),
      backChars = Math.floor(charsToShow / 2);
  
    return (
      fullStr.substr(0, frontChars) +
      separator +
      fullStr.substr(fullStr.length - backChars)
    );
}

export enum NftPrivilege {
    ROOT = null,
    NONE = 1,
    ADDER = 2
}

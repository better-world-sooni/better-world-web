const prefix = "https://db8vrbsl16ap9.cloudfront.net"

const images = {
    KAKAO_KLIP_ICON: '/images/logos/klipLogo.svg',
    KAIKAS_ICON: '/images/logos/kaikasLogo.svg',
    gomzAstronaut: "/images/gomzAstronaut.gif",
    metaverse: '/videos/metaverse.mp4',
    betterWorldBWLogo: '/images/logos/betterWorldBWLogo.png',
    betterWorldBlueLogo: '/images/logos/betterWorldBlueLogo.png',
    betterWorldWhiteLogo: '/images/logos/betterWorldWhiteLogo.png',
    betterWorldBlueShadowLogo: '/images/logos/betterWorldBlueShadowLogo.png',
    betterWorldFullLogo: '/images/logos/betterWorldFullLogo.png',
    betterWorl_colorLogo: '/images/logos/betterWorldLogo_Alpha.png',
    betterWorldWord: '/images/logos/betterWorldWord.png',
    webeDraft: '/images/webeDraft.png',
    webeDraft2: '/images/webeDraft2.png',
    webeDraft3: '/images/webeDraft3.png',
    appDraft1: {
        bgback:'/images/appDraft1_1.png',
        bgfront1:'/images/appDraft1_2_1.png',
        bgfront2:'/images/appDraft1_2_2.png',
        content:'/images/appDraft1_3.png',
        
    },
    appDraft2: {
        tool:'/images/appDraft2_1.png',
        content:'/images/appDraft2_2.png',
    },
    appDraft3: {
        initial:'/images/appDraft3_1.png',
        end:'/images/appDraft3_2.png',
    },
    appDraft4: {
        initial:'/images/appDraft4_1.png',
        end:'/images/appDraft4_2.png',
    },
    appDraft5: {
        initial:'/images/appDraft5_1.png',
        end:'/images/appDraft5_2.png',
    },
    appDraft6: {
        holder:{
            initial:'/images/appDraft6_1.png',
            end:'/images/appDraft6_2.png',
        },
        auth:{
            initial:'/images/appDraft6_3.png',
            end:'/images/appDraft6_4.png',
        }
    },
    kaikas:"/images/kaikas.png",
    logoword:{
        firstBlack:'/images/words/word1.png',
        secondGradient:'/images/words/word2.png',
        firstGradient:'/images/words/word3.png',
        secondBlack:'/images/words/word4.png',
        firstWhite:'/images/words/word5.png',
        secondWhite:'/images/words/word6.png',
    },
    headerbg:'/images/background.png',
    bwLogo: {
        bg:'/images/bwLogo_1.png',
        content:'/images/bwLogo_2.png',
    },
    iphon13: '/images/iphone13_pro.png',
    gomzDAOExample: '/images/gomzDAOExample.png',
    backButton: '/images/back.png',
    betterWorldFeedExample: '/images/feed.png',
    appView: '/images/appView.png',
    connectExample: '/images/connect.png',
    downloadOnAppStore: '/images/downloadOnAppStore.png',
    downloadOnGooglePlay: '/images/downloadOnGooglePlay.png',
    characters: {
        default: '/images/characters/basicBearNBg.png'
    },
}

const addPrefixToImageUris = (data) => {
	data &&
		Object.entries(data).map(([key, v]) => {
			if (typeof v === "string") {
				const source = prefix + v;
				data[key] = source;
				if (typeof Image !== "undefined") new Image().src = source;
			} else if (typeof v === "object") {
				addPrefixToImageUris(v);
			}
		});
};
(function () {
	addPrefixToImageUris(images);
})();

export const IMAGES = images;
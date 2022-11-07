const prefix = "https://db8vrbsl16ap9.cloudfront.net";

const images = {
  KAKAO_KLIP_ICON: "/images/logos/klipLogo.svg",
  KAIKAS_ICON: "/images/logos/kaikasLogo.svg",
  gomzAstronaut: "/images/gomzAstronaut.gif",
  metaverse: "/videos/metaverse.mp4",
  betterWorldBWLogo: "/images/logos/betterWorldBWLogo.png",
  betterWorldBlueLogo: "/images/logos/betterWorldBlueLogo.png",
  betterWorldWhiteLogo: "/images/logos/betterWorldWhiteLogo.png",
  betterWorldBlueShadowLogo: "/images/logos/betterWorldBlueShadowLogo.png",
  betterWorldFullLogo: "/images/logos/betterWorldFullLogo.png",
  betterWorl_colorLogo: "/images/logos/betterWorldLogo_Alpha.png",
  betterWorldWord: "/images/logos/betterWorldWord.png",
  webeDraft: "/images/webeDraft.png",
  webeDraft2: "/images/webeDraft2.png",
  webeDraft3: "/images/webeDraft3.png",
  mainbackground: "/images/background.png",
  aggregatorDraft: {
    feed: "/images/aggregator_draft/aggregator_feed.png",
    detail: "/images/aggregator_draft/aggregator_detail.png",
  },
  donationDraft: {
    feed: "/images/donation_draft/donation_feed.png",
    detail: "/images/donation_draft/donation_detail.png",
  },
  verificationDraft: {
    feed: "/images/verification_draft/verification_feed.png",
    verification: "/images/verification_draft/verification_verification.png",
    camera: "/images/verification_draft/verification_camera.png",
    success: "/images/verification_draft/verification_success.png",
  },
  chatDraft: {
    feed: "/images/chat_draft/chat_feed.png",
    detail: "/images/chat_draft/chat_detail.png",
  },
  socialDraft: {
    feed: "/images/social_draft/social_feed.png",
    header: "/images/social_draft/social_header.png",
  },
  kaikas: "/images/kaikas.png",
  logoword: {
    firstBlack: "/images/words/word1.png",
    secondGradient: "/images/words/word2.png",
    secondGradientNew: "/images/words/word2_new.png",
    firstGradient: "/images/words/word3.png",
    secondBlack: "/images/words/word4.png",
    firstWhite: "/images/words/word5.png",
    secondWhite: "/images/words/word6.png",
  },
  headerbg: "/images/background.png",
  bwLogo: {
    bg: "/images/bwLogo_1.png",
    content: "/images/bwLogo_2.png",
  },
  iphon13: "/images/iphone13_pro.png",
  gomzDAOExample: "/images/gomzDAOExample.png",
  backButton: "/images/back.png",
  betterWorldFeedExample: "/images/feed.png",
  appView: "/images/appView.png",
  connectExample: "/images/connect.png",
  downloadOnAppStore: "/images/downloadOnAppStore.png",
  downloadOnGooglePlay: "/images/downloadOnGooglePlay.png",
  characters: {
    default: "/images/characters/basicBearNBg.png",
  },
};

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

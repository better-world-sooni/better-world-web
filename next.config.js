/** @type {import('next').NextConfig} */
module.exports = {
  i18n: {
    locales: ['ko'],
    defaultLocale: 'ko',
  },
  publicRuntimeConfig: {
    CONF_SERVER_URL: process.env.CONF_SERVER_URL,
    CONF_COOKIE_DOMAIN: process.env.CONF_COOKIE_DOMAIN,
    CONF_IS_DEVELOPMENT: process.env.CONF_IS_DEVELOPMENT,
  },
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
  reactStrictMode: false,
  images: {
    domains: ['gomz-images.s3.ap-northeast-2.amazonaws.com']
  }
}

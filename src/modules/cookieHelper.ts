import Cookies from 'universal-cookie'
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

export const COOKIE_DOMAIN = publicRuntimeConfig.CONF_COOKIE_DOMAIN || 'betterworld.io'
export const COOKIE_OPT = { domain: COOKIE_DOMAIN, path: '/' }

export const getJwt = () => {
    const cookies = new Cookies();
    return cookies.get('jwt')
}
export const setJwt = (jwt) => {
    if(!jwt) return;
    const cookies = new Cookies();
    return cookies.set('jwt', jwt, COOKIE_OPT)
}
export const removeJwt = () => {
    const cookies = new Cookies();
    return cookies.remove('jwt', COOKIE_OPT)
}
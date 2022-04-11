import Router from "next/router"

export const href = (url) => {
    Router.replace(url)
}
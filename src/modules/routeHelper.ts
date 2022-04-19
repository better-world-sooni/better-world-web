import Router from "next/router"

export const href = (url: string) => {
    Router.push(url)
}
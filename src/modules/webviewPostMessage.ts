const blankFunction = () => {
    return false
}
const rnPostMssage = (args) => {
    const message = JSON.stringify({
        bwwMessage: args,
    })
    postMessage(message, '*')
    return true
}
// @ts-ignore
const notWebview = typeof window == 'undefined' || typeof window.ReactNativeWebView == 'undefined'
const webviewPostMessage = notWebview ? blankFunction : rnPostMssage

export default webviewPostMessage;
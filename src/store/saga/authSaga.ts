import { call, put, takeEvery } from 'redux-saga/effects'
import useWebviewPostMessage from 'src/modules/webviewPostMessage'
import { setCurrentNftJwt } from 'src/modules/authHelper'
import { removeJwt, setJwt } from 'src/modules/cookieHelper'
import { href } from 'src/modules/routeHelper'
import { CHANGE_NFT, LOGIN, REMOVE_ACCOUNT } from '../reducers/authReducer'
import webviewPostMessage from 'src/modules/webviewPostMessage'

function* loginSaga(action) {
    yield call(setJwt, action.jwt)
    if (action.redirect) {
      yield call(href, action.redirect)
    } else {
      location.reload()
    }
}

function* removeAccountSaga(action) {
  yield call(removeJwt)
  if (action.redirect) {
    yield call(href, action.redirect)
  } else {
    location.reload()
  }
}

function* changeNftSaga(action) {
  yield call(setCurrentNftJwt, {...action})
  if (action.redirect) {
    yield call(href, action.redirect)
  } else {
    location.reload()
  }
}

export default function* watchAuth() {
  yield takeEvery(LOGIN, loginSaga)
  yield takeEvery(REMOVE_ACCOUNT, removeAccountSaga)
  yield takeEvery(CHANGE_NFT, changeNftSaga)
}

import { call, put, takeEvery } from 'redux-saga/effects'
import apis from 'src/modules/apis'
import { setCurrentNftJwt } from 'src/modules/authHelper'
import { setJwt } from 'src/modules/cookieHelper'
import { href } from 'src/modules/routeHelper'
import { urls } from 'src/modules/urls'
import { CHANGE_NFT, LOGIN } from '../reducers/authReducer'
import { confettiAction } from '../reducers/modalReducer'

function* loginSaga(action) {
    yield call(setJwt, action.jwt)
    yield put(confettiAction({enabled: true}))
    yield call(href, action.redirect)
}

function* changeNftSaga(action) {
  yield call(setCurrentNftJwt, {...action})
  yield call(href, action.redirect)
}

export default function* watchAuth() {
  yield takeEvery(LOGIN, loginSaga)
  yield takeEvery(CHANGE_NFT, changeNftSaga)
}

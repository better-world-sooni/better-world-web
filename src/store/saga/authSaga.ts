import { call, put, takeEvery } from 'redux-saga/effects'
import { setJwt } from 'src/modules/cookieHelper'
import { href } from 'src/modules/routeHelper'
import { urls } from 'src/modules/urls'
import { LOGIN, loginAction } from '../reducers/authReducer'
import { confettiAction } from '../reducers/modalReducer'

function* loginSaga(action) {
    yield call(setJwt, action.jwt)
    yield put(confettiAction({enabled: true}))
    yield call(href, urls.profile.klaytnAddress(action.user.klaytn_account.address))
    // yield put(loginAction(action.payload)) call another fx
}

export default function* watchAuth() {
  yield takeEvery(LOGIN, loginSaga)
}

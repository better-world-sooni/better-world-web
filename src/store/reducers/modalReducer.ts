const initialState = {
  signIn: {
    enabled: false
  },
  emailVerification: {
    enabled: false
  },
  klipQR: {
    enabled: false,
    qrImage: null,
    requestKey: null,
  },
  confetti: {
    enabled: false,
  }
}

// action type
export const CONFETTI = 'modal/LOGIN' as const
export const SIGN_IN = 'modal/SIGNIN' as const
export const EMAIL_VERIFICATION = 'modal/EMAIL_VERIFICATION' as const
export const KLIP_QR_ACTION = 'modal/KLIP_QR_ACTION' as const

// action function
export const confettiAction = ({enabled}) => ({ type: CONFETTI, enabled })
export const signInAction = ({enabled}) => ({ type: SIGN_IN, enabled })
export const emailVerificationAction = ({enabled}) => ({ type: EMAIL_VERIFICATION, enabled })
export const klipQRAction = ({enabled, qrImage, requestKey}) => ({ type: KLIP_QR_ACTION, enabled, qrImage, requestKey })

const f = (action, func) => func(action)

export const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONFETTI:
      return f(action, ({ enabled }) => {
        return {
          ...state,
          confetti: {
            enabled
          }
        }
      })
    case SIGN_IN:
      return f(action, ({ enabled }) => {
        return {
          ...state,
          signIn: {
            enabled
          }
        }
      })
    case EMAIL_VERIFICATION:
      return f(action, ({ enabled }) => {
        return {
          ...state,
          emailVerification: {
            enabled
          }
        }
      })
    case KLIP_QR_ACTION:
      return f(action, ({ enabled, qrImage, requestKey }) => {
        return {
          ...state,
          klipQR: {
            enabled,
            qrImage, 
            requestKey
          }
        }
      })
    default: {
      return state
    }
  }
}

const initialState = {
  loginStatus: {
    enabled: false
  },
}

// action type
export const LOGIN = 'auth/LOGIN' as const
export const LOGINSTATUS = 'auth/LOGINSTATUS' as const
export const REMOVE_ACCOUNT = 'auth/REMOVE_ACCOUNT' as const
export const CHANGE_NFT = 'auth/CHANGE_NFT' as const

// action function
export const loginAction = ({redirect = null, jwt}) => ({ type: LOGIN, redirect, jwt })
export const loginStatusAction = ({enabled})=>({type: LOGINSTATUS, enabled})
export const removeAccountAuthAction = ({redirect = null}) => ({ type: REMOVE_ACCOUNT, redirect })
export const changeNftAction = ({contract_address, token_id, redirect = null}) => ({ type: CHANGE_NFT, contract_address, token_id, redirect })

const f = (action, func) => func(action)

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return f(action, ({ redirect, jwt }) => {
        return {
          ...state
        }
      })
    case LOGINSTATUS:
      return f(action, ({ enabled }) => {
        return {
          ...state,
          loginStatus: {
            enabled
          },
        }
      })
    case REMOVE_ACCOUNT:
      return f(action, ({ redirect }) => {
        return {
          ...state
        }
      })
    case CHANGE_NFT:
      return f(action, ({ contract_address, token_id, redirect }) => {
        return {
          ...state
        }
      })
    default: {
      return state
    }
  }
}
const initialState = {

}

// action type
export const LOGIN = 'auth/LOGIN' as const
export const CHANGE_NFT = 'auth/CHANGE_NFT' as const

// action function
export const loginAction = ({redirect, jwt}) => ({ type: LOGIN, redirect, jwt })
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
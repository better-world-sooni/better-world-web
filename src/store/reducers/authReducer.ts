const initialState = {

}

// action type
export const LOGIN = 'auth/LOGIN' as const

// action function
export const loginAction = ({user, jwt}) => ({ type: LOGIN, user, jwt })

const f = (action, func) => func(action)

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return f(action, ({ user, jwt }) => {
        return {
          ...state
        }
      })
    default: {
      return state
    }
  }
}
const initialState = {
  loggedIn: false,
  jwt: ''
}

// action type
export const LOGIN = 'auth/LOGIN' as const

// action function
export const loginAction = ({loggedIn, jwt}) => ({ type: LOGIN, loggedIn, jwt })

const f = (action, func) => func(action)

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return f(action, ({ loggedIn, jwt }) => {
        return {
          loggedIn,
          jwt
        }
      })
    default: {
      return state
    }
  }
}
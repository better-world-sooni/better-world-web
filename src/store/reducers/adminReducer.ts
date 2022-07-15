const initialState = {
  showuserlist: {
    user_list: null
  },
  fetchingData: {
    loading: false,
    error: false,
    success: false
  },
}

// action type
export const USER_LIST = 'admin/USER_LIST' as const
export const LOADING = 'admin/LOADING' as const


// action function
export const userlistAction = ({user_list}) => ({ type: USER_LIST, user_list})
export const loadingAction = ({loading, error, success}) => ({ type: LOADING, loading, error, success })

const f = (action, func) => func(action)

export const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LIST:
      return f(action, ({user_list}) => {
        return {
          ...state,
          showuserlist: {
            user_list,
          }
        }
      })
      case LOADING:
        return f(action, ({loading, error, success}) => {
          return {
            ...state,
            fetchingData: {
              loading,
              error,
              success
            }
          }
        })
    default: {
      return state
    }
  }
}

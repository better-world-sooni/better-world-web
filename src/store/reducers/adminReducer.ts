const initialState = {
  currentNft: {
    currentNft: null
  },
  UserListPage: {
    page_size: 50,
    offset: 0,
  },
}

// action type
export const CURRENT_NFT = 'admin/CURRENT_NFT' as const
export const USERLIST = 'admin/USERLIST' as const

// action function
export const currentNftAction = ({currentNft}) => ({ type: CURRENT_NFT, currentNft})
export const UserListAction = ({page_size, offset}) => ({ type: USERLIST, page_size, offset})

const f = (action, func) => func(action)

export const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case CURRENT_NFT:
      return f(action, ({currentNft}) => {
        return {
          ...state,
          currentNft: {
            currentNft,
          }
        }
      })
      case USERLIST:
        return f(action, ({page_size, offset}) => {
          return {
            ...state,
            UserListPage: {
              page_size,
              offset,
            }
          }
        })
    default: {
      return state
    }
  }
}

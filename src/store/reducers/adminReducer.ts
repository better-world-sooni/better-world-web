import { defaultPageSize } from "src/hooks/queries/admin/userlist"

const initialState = {
  currentNft: {
    currentNft: null,
  },
  UserListPage: {
    page_size: defaultPageSize,
    offset: 0,
  },
  UserListPostPage: {
    page_size: defaultPageSize,
    offset: 0,
  },
}

// action type
export const CURRENT_NFT = 'admin/CURRENT_NFT' as const
export const USERLISTPAGE = 'admin/USERLISTPAGE' as const
export const USERLISTPOST = 'admin/USERLISTPOST' as const

// action function
export const currentNftAction = ({currentNft}) => ({ type: CURRENT_NFT, currentNft})
export const UserListAction = ({page_size, offset}) => ({ type: USERLISTPAGE, page_size, offset})
export const UserListPostAction = ({page_size, offset}) => ({ type: USERLISTPOST, page_size, offset})

const f = (action, func) => func(action)

export const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case CURRENT_NFT:
      return f(action, ({currentNft}) => {
        return {
          ...state,
          currentNft: {
            currentNft
          }
        }
      })
      case USERLISTPAGE:
        return f(action, ({page_size, offset}) => {
          return {
            ...state,
            UserListPage: {
              page_size,
              offset,
            }
          }
        })
        case USERLISTPOST:
        return f(action, ({page_size, offset}) => {
          return {
            ...state,
            UserListPostPage: {
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

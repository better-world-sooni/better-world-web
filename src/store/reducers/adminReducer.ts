import { defaultPageSize } from "src/hooks/queries/admin/userlist"

const initialState = {
  currentNft: {
    currentNft: null,
  },
  UserListPage: {
    page_size: defaultPageSize,
    offset: 0,
    search_key: "",
  },
  UserListPostPage: {
    page_size: defaultPageSize,
    offset: 0,
    search_key: "",
  },
}

// action type
export const CURRENT_NFT = 'admin/CURRENT_NFT' as const
export const USERLISTPAGE = 'admin/USERLISTPAGE' as const
export const USERLISTPOST = 'admin/USERLISTPOST' as const

// action function
export const currentNftAction = ({currentNft}) => ({ type: CURRENT_NFT, currentNft})
export const UserListAction = ({page_size, offset, search_key}) => ({ type: USERLISTPAGE, page_size, offset, search_key})
export const UserListPostAction = ({page_size, offset, search_key}) => ({ type: USERLISTPOST, page_size, offset, search_key})

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
        return f(action, ({page_size, offset, search_key}) => {
          return {
            ...state,
            UserListPage: {
              page_size,
              offset,
              search_key,
            }
          }
        })
        case USERLISTPOST:
        return f(action, ({page_size, offset, search_key}) => {
          return {
            ...state,
            UserListPostPage: {
              page_size,
              offset,
              search_key,
            }
          }
        })
    default: {
      return state
    }
  }
}

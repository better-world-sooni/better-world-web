import { combineReducers } from '@reduxjs/toolkit'
import { authReducer } from './authReducer'
import { modalReducer } from './modalReducer'
import { adminReducer} from './adminReducer'

export const rootReducer = combineReducers({
  auth: authReducer,
  modal: modalReducer,
  admin: adminReducer,
})

export type RootState = {
  auth: ReturnType<typeof authReducer>
  modal: ReturnType<typeof modalReducer>
  admin: ReturnType<typeof adminReducer>
}
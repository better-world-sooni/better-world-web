import { combineReducers } from '@reduxjs/toolkit'
import { authReducer } from './authReducer'
import { modalReducer } from './modalReducer'

export const rootReducer = combineReducers({
  auth: authReducer,
  modal: modalReducer,
})

export type RootState = {
  auth: ReturnType<typeof authReducer>
  modal: ReturnType<typeof modalReducer>
}
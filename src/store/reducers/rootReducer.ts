import { combineReducers } from '@reduxjs/toolkit'
import { authReducer } from './authReducer'
import { fullMapReducer } from './fullMapReducer'
import { modalReducer } from './modalReducer'

export const rootReducer = combineReducers({
  auth: authReducer,
  modal: modalReducer,
  fullMap: fullMapReducer,
})

export type RootState = {
  auth: ReturnType<typeof authReducer>
  modal: ReturnType<typeof modalReducer>
  fullMap: ReturnType<typeof fullMapReducer>
}
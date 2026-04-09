import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthState, User } from '../../../types'

const initialState: AuthState = {
  user: null,
  token: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      { payload: { user, token } }: PayloadAction<{ user: Pick<User, 'id' | 'name' | 'email' | 'role'>; token: string }>
    ) => {
      state.user = user
      state.token = token
    },
    logout: (state) => {
      state.user = null
      state.token = null
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer

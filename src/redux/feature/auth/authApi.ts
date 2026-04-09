import { baseApi } from '../../api/baseApi'
import { LoginRequest, LoginResponse } from '../../../types'
import { setCredentials } from './authSlice'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(
            setCredentials({
              user: data.user,
              token: data.accessToken,
            })
          )
        } catch (err) {
          // Error handled by UI or RTK Query error middleware
        }
      },
    }),
  }),
})

export const { useLoginMutation } = authApi

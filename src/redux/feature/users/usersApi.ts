import { baseApi } from '../../api/baseApi'
import { User } from '../../../types'

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: ['User'],
    }),
  }),
})

export const { useGetUsersQuery } = usersApi

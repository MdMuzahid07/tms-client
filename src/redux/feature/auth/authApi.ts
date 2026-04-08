import baseApi from "../../api/baseApi";
import type { ApiResponse, User } from "@/types/api";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResult {
  accessToken: string;
  user: User;
}

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<LoginResult>, LoginPayload>({
      query: (credentials: LoginPayload) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;

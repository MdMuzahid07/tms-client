import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

const normalizeApiBaseUrl = () => {
  const raw = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  const runtimeDefault =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.hostname}:5000`
      : "http://localhost:5000";

  const base = (raw || runtimeDefault).replace(/\/+$/, "");
  return base.endsWith("/api") ? base : `${base}/api`;
};

export const API_BASE_URL = normalizeApiBaseUrl();

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  // JWT is sent via Authorization header, so cross-origin cookies are unnecessary.
  // Using omit avoids credentialed CORS restrictions during local dev.
  credentials: "omit",
  // extra added with fetchBaseQuery
  // in prepareHeaders we get two parameters (header,api), we get the getState() from the api
  prepareHeaders: (headers, { getState }) => {
    // getting the token from the redux state
    const token = (getState() as RootState).auth.accessToken;

    // if token find we are setting it to header, by headers.set() , in this method we have to pass
    // two arguments, one is "authorization", second is token, if backend receiving bearer then with bearer
    // otherwise just token
    if (token) headers.set("authorization", `Bearer ${token}`);

    return headers;
  },
});

// when our access token invalidate we are getting an error,
// we need to renew our access token by using refresh token
// to do this we can make an custom base query by following redux documentation (Implementing a custom baseQuery);
// we have to take tree arguments(args, api, and extraOptions) to create custom base query

const baseApi = createApi({
  reducerPath: "baseApi",
  // baseQuery: fetchBaseQuery({
  //     baseUrl: "http://localhost:5000/api/v1",
  //     credentials: "include"
  // }),
  // cleaner syntax => just storing in a variable and using here
  // we calling baseQuery in our custom base query, thats why it will call from there
  // because we called our baseQuery in our custom base query thats why we need to set here the custom one
  baseQuery,
  tagTypes: ["Tasks", "Users", "AuditLogs"],
  endpoints: () => ({}),
});

export default baseApi;

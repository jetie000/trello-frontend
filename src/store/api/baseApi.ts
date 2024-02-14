import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { variables } from "@/variables";
import { api } from "@/http";

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: '' }) =>
    async ({ url, method, data, params, headers }: any) => {
      try {
        const result = await api({
          url: baseUrl + url,
          method,
          data,
          params,
          headers,
        })
        return { data: result.data }
      } catch (axiosError: any) {
        const err = axiosError
        return {
          error: {
            status: err.response?.status,
            data: err.response?.data || err.message,
          },
        }
      }
    }

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: axiosBaseQuery({
    baseUrl: variables.API_URL,
  }),
  tagTypes: ['User', 'Users'],
  endpoints: () => ({}),
});
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { variables } from "@/variables";
import { AuthResponse } from "@/types/authResponse.interface";

const baseQuery = fetchBaseQuery({
    baseUrl: variables.API_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
        if (localStorage.getItem(variables.TOKEN_LOCALSTORAGE))
            headers.set('Authorization',`Bearer ${localStorage.getItem(variables.TOKEN_LOCALSTORAGE)}`)
        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);

        if (refreshResult.data) {
            localStorage.setItem(variables.TOKEN_LOCALSTORAGE, (refreshResult.data as AuthResponse).accessToken)
            result = await baseQuery(args, api, extraOptions);
        } else {
            localStorage.removeItem(variables.TOKEN_LOCALSTORAGE)
            localStorage.removeItem(variables.USERID_LOCALSTORAGE)
        }
    }
    return result;
};

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User', 'Users'],
    endpoints: () => ({}),
});
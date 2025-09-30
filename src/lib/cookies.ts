import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const setTokens = (accessToken: string, refreshToken: string, rememberMe: boolean) => {
    const options: Cookies.CookieAttributes = {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    };

    if (rememberMe) {
        options.expires = 30; // 30 days
    }

    Cookies.set(ACCESS_TOKEN_KEY, accessToken, options);
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, options);
};

export const getAccessToken = () => {
    return Cookies.get(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = () => {
    return Cookies.get(REFRESH_TOKEN_KEY);
};

export const removeTokens = () => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
};

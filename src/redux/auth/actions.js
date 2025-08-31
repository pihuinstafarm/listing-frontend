import * as types from './types'

export const fetchUserDetails = () => {
    return {
        type: types.FETCH_USER_DETAILS,
    }
}

export const setUserDetails = (details) => {
    return {
        type: types.SET_USER_DETAILS,
        payload: details,
    }
}

export const setShowLogin = (showLogin) => {
    return {
        type: types.SET_SHOW_LOGIN,
        payload: showLogin,
    }
}

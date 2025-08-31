import * as types from './types'

const initialState = {
    user: {},
    showLogin: false,
    loading: false,
}

const postsReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.FETCH_USER_DETAILS:
            return {
                ...state,
                loading: true,
            }
        case types.SET_USER_DETAILS:
            return {
                ...state,
                user: action.payload,
                loading: false,
            }
        case types.SET_SHOW_LOGIN:
            return {
                ...state,
                showLogin: action.payload,
            }
        default:
            return state
    }
}

export default postsReducer

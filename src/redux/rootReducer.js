import { combineReducers } from 'redux'

import authReducer from './auth/reducer'
import postsReducer from './post/reducer'

const rootReducer = combineReducers({
    auth: authReducer,
    posts: postsReducer,
})

export default rootReducer

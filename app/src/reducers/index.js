import { combineReducers } from 'redux'
import { NETWORK_SCAN, SET_MODE } from '../actions/types'

function resultReducer(state = {}, action) {
    switch(action.type) {
        case NETWORK_SCAN:
            let resultData = action.results
            console.log("REDUCER")
            console.log(resultData)
            return {
                results: resultData
            }
        case SET_MODE:
            return action.mode
        default:
            return state
    }
}

export default combineReducers({
    data: resultReducer
})
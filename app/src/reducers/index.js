import { combineReducers } from 'redux'
import { NETWORK_SCAN, SET_MODE, SET_TIME, ACTIVE_PROCESS } from '../actions/types'

function resultReducer(state = {}, action) {
    switch(action.type) {
        case NETWORK_SCAN:
            let resultData = action.results
            return resultData
        default:
            return state
    }
}

function modeReducer(state={mode:null, subMode:null}, action) {
    switch(action.type) {
        case SET_MODE:
            return action.mode
        default:
            return state
    }
}

function timeReducer(state={time:0}, action) {
    switch(action.type) {
        case SET_TIME:
            return action.time
        default:
            return state
    }
}

function processReducer(state=false, action) {
    switch(action.type) {
        case ACTIVE_PROCESS:
            return action.process
        default:
            return state
    }
}

export default combineReducers({
    data: resultReducer,
    scanMode: modeReducer,
    scanTime: timeReducer,
    activeProcess: processReducer
})
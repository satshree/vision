import { NETWORK_SCAN, SET_MODE, SET_TIME } from '../actions/types'

export function resultReducer(state = {}, action) {
    switch(action.type) {
        case NETWORK_SCAN:
            let resultData = action.results
            return {
                results: resultData
            }
        default:
            return state
    }
}

export function modeReducer(state={mode:null, subMode:null}, action) {
    switch(action.type) {
        case SET_MODE:
            return action.mode
        default:
            return state
    }
}

export function timeReducer(state=0, action) {
    switch(action.type) {
        case SET_TIME:
            return action.time
        default:
            return state
    }
}
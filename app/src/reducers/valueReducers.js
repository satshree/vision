import { SET_FIRST_IP, SET_LAST_IP, SET_ONLY_IP } from '../actions/types'

export function firstIPReducer(state="", action) {
    switch(action.type) {
        case SET_FIRST_IP:
            return action.ip
        default:
            return state
    }
} 

export function lastIPReducer(state="", action) {
    switch(action.type) {
        case SET_LAST_IP:
            return action.ip
        default:
            return state
    }
} 

export function onlyIPReducer(state="", action) {
    switch(action.type) {
        case SET_ONLY_IP:
            return action.ip
        default:
            return state
    }
} 
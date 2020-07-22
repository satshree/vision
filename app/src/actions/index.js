import { NETWORK_SCAN, SET_MODE, SET_TIME, ACTIVE_PROCESS } from './types'


// SCAN ACTIONS

export const scanNetwork = (results) => dispatch => {
    dispatch({
        type: NETWORK_SCAN,
        results: results
    })
    
}


// PROCESS ACTIONS

export const setActiveProcess = () => dispatch => {
    dispatch({
        type: ACTIVE_PROCESS,
        process: true
    })
}

export const removeActiveProcess = () => dispatch => {
    dispatch({
        type: ACTIVE_PROCESS,
        process: false
    })
}


// SET MODE ACTIONS

export const setModeNull = () => dispatch => {
    dispatch({
        type: SET_MODE,
        mode: { mode: null, subMode:null }
    })
}

export const setModeDefault = () => dispatch => {
    dispatch({
        type: SET_MODE,
        mode: { mode: "DEFAULT", subMode:null }
    })
}

export const setModeCustomRange = () => dispatch => {
    dispatch({
        type: SET_MODE,
        mode: { mode: "CUSTOM", subMode: "Range" }

    })
}

export const setModeCustomOnly = () => dispatch => {
    dispatch({
        type: SET_MODE,
        mode: { mode: "CUSTOM", subMode: "Only" }

    })
}

export const setModeComplete = () => dispatch => {
    dispatch({
        type: SET_MODE,
        mode: { mode: "COMPLETE", subMode:null }
    })
}

export const setTime = (time) => dispatch => {
    dispatch({
        type: SET_TIME,
        time
    })
}
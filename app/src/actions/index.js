import { NETWORK_SCAN, SET_MODE } from './types'

export const scanNetwork = (results) => dispatch => {
    // console.log("ACTION")
    // console.log(results)
    dispatch({
        type: NETWORK_SCAN,
        results: results
    })
    
}

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

export const setModeCustom = () => dispatch => {
    dispatch({
        type: SET_MODE,
        mode: { mode: "CUSTOM", subMode: null }

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
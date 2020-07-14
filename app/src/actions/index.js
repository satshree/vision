import { NETWORK_SCAN, SET_MODE } from './types'

export const scanNetwork = (results) => dispatch => {
    // console.log("ACTION")
    // console.log(results)
    dispatch({
        type: NETWORK_SCAN,
        results: results
    })
    
}

export const setModeDefault = () => dispatch => {
    dispatch({
        type: SET_MODE,
        mode: { mode: "DEFAULT" }
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
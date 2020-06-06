import {Action} from '../model/action'

export const isType = <T>(object: any): object is T => object !== undefined

export const createReducer = <T>(defaultState: T, stateMap: Record<string, (state: T, action?: Action<any>) => T>) =>
    (state: T, action?: Action<any>): T => action && stateMap[action.type]
        ? stateMap[action.type](state || defaultState, action)
        : state || defaultState

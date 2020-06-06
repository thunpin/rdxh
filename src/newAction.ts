import {Action, defaultAction} from './model/action'
import {defaultState, State} from './model/state'
import {RdxAction} from './model/rdxAction'
import {createReducer, isType} from './lib/createReducer'

type toResult<T, R> = (current: T, previous: R) => R

export const newAction = <T, R>(actionName: string, executeState: toResult<T, R>): RdxAction<T, R> => {
    const executeType = `${actionName}::execute`
    const resetType = `${actionName}::reset`

    const newActionObject = <T>(content: T): Action<T> => ({type: executeType, payload: content})

    const addType = (actionObject: any) => actionObject.type = actionName

    const addClearAction = (actionObject: any) => actionObject.reset = () => ({...defaultAction, type: resetType})

    const addToState = (actionObject: any) => actionObject.toState = (reduxState: any) =>
        reduxState && isType<State<R>>(reduxState[actionName]) ? reduxState[actionName] : defaultState

    const addReducer = (actionObject: any) => {
        const states = {}
        states[executeType] = (state, action) => ({content: executeState(action.payload, state.content)})
        states[resetType] = () => defaultState
        return actionObject.reducer = createReducer<State<R>>(defaultState, states)
    }

    return [
        addType,
        addClearAction,
        addToState,
        addReducer,
    ].reduce(apply, newActionObject)
}

const apply = (value: any, func: (param: any) => any) => {
    func(value)
    return value
}

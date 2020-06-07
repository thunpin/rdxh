import {Action, defaultAction} from './model/action'
import {AsyncState, defaultAsyncState} from './model/state'
import {RdxAsyncAction} from './model/rdxAction'
import {createReducer, isType} from './lib/createReducer'

type toResult<T, R> = (current: T, previous: R) => R

export const newAsyncAction = <T, R>(actionName: string, executeState: toResult<T, R>): RdxAsyncAction<T, R> => {
    const executeType = `${actionName}::execute`
    const successType = `${actionName}::success`
    const failedType = `${actionName}::failed`
    const resetType = `${actionName}::reset`

    const newActionObject = <T>(content: T): Action<T> => ({type: executeType, payload: content})

    const addType = (actionObject: any) => actionObject.type = actionName

    const addSuccessAction = (actionObject: any) => actionObject.success = (content: R) =>
        ({type: successType, payload: content})

    const addErrorAction = (actionObject: any) => actionObject.failed = (error: Error) =>
        ({type: failedType, payload: error})

    const addClearAction = (actionObject: any) => actionObject.reset = () => ({...defaultAction, type: resetType})

    const addToState = (actionObject: any) => actionObject.toState = (reduxState: any) =>
        reduxState && isType<AsyncState<R>>(reduxState[actionName]) ? reduxState[actionName] : defaultAsyncState

    const addReducer = (actionObject: any) => {
        const states = {}
        states[executeType] = (state, action) => ({
            ...defaultAsyncState,
            content: executeState(action.payload, state.content)
        })
        states[resetType] = () => defaultAsyncState
        actionObject.reducer = createReducer<AsyncState<R>>(defaultAsyncState, states)
    }

    const addToCombineReducer = (actionObject: any) => {
        const combinedReducer = {}
        combinedReducer[actionName] = actionObject.reducer
        actionObject.toCombineReducer = combinedReducer
    }

    return [
        addType,
        addSuccessAction,
        addErrorAction,
        addClearAction,
        addToState,
        addReducer,
        addToCombineReducer
    ].reduce(apply, newActionObject)
}

const apply = (value: any, func: (param: any) => any) => {
    func(value)
    return value
}

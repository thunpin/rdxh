import {Action, defaultAction} from './model/action'
import {AsyncState, defaultAsyncState, defaultFailedState} from './model/state'
import {RdxAsyncAction} from './model/rdxAction'
import {createReducer, isType} from './lib/common'

const defaultExecute = <T>(state: AsyncState<T>): AsyncState<T> => ({...state, isLoading: true})
export type executeStateType<T, R> = (state: AsyncState<R>, action: Action<T>) => AsyncState<R>

export const newAsyncAction = <T, R>(actionName: string,
                                     execute: executeStateType<T, R> = defaultExecute): RdxAsyncAction<T, R> => {
    const executeType = `${actionName}`
    const successType = `${actionName}::success`
    const failedType = `${actionName}::failed`
    const resetFailedType = `${actionName}::resetFailed`
    const resetType = `${actionName}::reset`

    const newActionObject = (content: T): Action<T> => ({type: executeType, payload: content})

    const addType = (actionObject: any) => actionObject.type = executeType

    const addSuccessType = (actionObject: any) => actionObject.successType = successType

    const addFailedType = (actionObject: any) => actionObject.failedType = failedType

    const addResetType = (actionObject: any) => actionObject.resetType = resetType

    const addSuccessAction = (actionObject: any) => actionObject.success = (content: R) => ({
        type: successType,
        payload: content
    })

    const addErrorAction = (actionObject: any) => actionObject.failed = (error: Error) => ({
        type: failedType,
        payload: error
    })

    const addResetFailedAction = (actionObject: any) => actionObject.resetFailed = () => ({
        ...defaultAction,
        type: resetFailedType
    })

    const addResetAction = (actionObject: any) => actionObject.reset = () => ({...defaultAction, type: resetType})

    const addToState = (actionObject: any) => actionObject.toState = (reduxState: any) =>
        reduxState && isType<AsyncState<R>>(reduxState[actionName]) ? reduxState[actionName] : defaultAsyncState

    const addReducer = (actionObject: any) => {
        const states = {}
        states[executeType] = execute
        states[successType] = (state, action: Action<R>) => ({...defaultAsyncState, content: action.payload})
        states[failedType] = (state, action: Action<Error>) => ({
            ...state,
            isLoading: false,
            hasError: true,
            error: action.payload
        })
        states[resetFailedType] = (state) => ({...state, ...defaultFailedState})
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
        addSuccessType,
        addFailedType,
        addResetType,
        addSuccessAction,
        addErrorAction,
        addResetFailedAction,
        addResetAction,
        addToState,
        addReducer,
        addToCombineReducer
    ].reduce(apply, newActionObject)
}

const apply = (value: any, func: (param: any) => any) => {
    func(value)
    return value
}

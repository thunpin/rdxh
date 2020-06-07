import {RdxAction} from './model/rdxAction'
import {newAsyncAction} from './newAsyncAction'
import {defaultAsyncState} from './model/state'

type toResult<T, R> = (current: T, previous: R) => R

export const newAction = <T, R>(actionName: string, executeState: toResult<T, R>): RdxAction<T, R> => newAsyncAction(
    actionName, (state, action) => ({
        ...defaultAsyncState,
        content: executeState(action.payload, state.content)
    }))

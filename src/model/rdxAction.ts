import {Action} from './action'
import {AsyncState, State} from './state'

export type ActionFunction<T> = (content: T) => Action<T>

export interface Rdx<T> {
    type: string
    reset: () => Action<any>
    reducer: (state?: T, action?: Action<any>) => T
    toState: (reduxState: any) => State<T>
    toCombineReducer: any
}

export interface RdxAsync<T> extends Rdx<AsyncState<T>> {
    success: (result: T) => Action<T>
    failed: (error: Error) => Action<Error>
    resetFailed: () => Action<any>
}

export type RdxAction<T, R> = ActionFunction<T> & Rdx<State<R>>
export type RdxAsyncAction<T, R> = ActionFunction<T> & RdxAsync<R>
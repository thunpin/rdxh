import {Action} from './action'
import {State} from './state'

export type ActionFunction<T> = (content: T) => Action<T>
export interface Rdx<T> {
    type: string
    reset: () => Action<any>
    reducer: (state?: State<T>, action?: Action<any>) => State<T>
    toState: (reduxState: any) => State<T>
}
export type RdxAction<T, R> = ActionFunction<T> & Rdx<R>
export interface State<R> {
    content: R
}

export interface FailedState {
    hasError: boolean
    error: Error
}

export interface LoadingState {
    isLoading: boolean
}

export interface AsyncState<R> extends State<R>, FailedState, LoadingState {
}

export const defaultState: State<any> = {content: undefined}
export const defaultFailedState: FailedState = {hasError: false, error: undefined as unknown as Error}
export const defaultLoadingState: LoadingState = {isLoading: false}
export const defaultAsyncState: AsyncState<any> = {...defaultState, ...defaultFailedState, ...defaultLoadingState}

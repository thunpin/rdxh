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

export interface SyncState<R> extends State<R>, FailedState {
}

export interface AsyncState<R> extends SyncState<R>, LoadingState {
}

export const defaultState: State<any> = {content: undefined}
export const defaultFailedState: FailedState = {hasError: false, error: undefined as unknown as Error}
export const defaultLoadingState: LoadingState = {isLoading: false}
export const defaultSyncState: SyncState<any> = {...defaultState, ...defaultFailedState}
export const defaultAsyncState: AsyncState<any> = {...defaultSyncState, ...defaultLoadingState}

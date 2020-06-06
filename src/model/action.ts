export interface Action<T> {
	type: string
	payload: T
}

export const defaultAction: Action<any> = {
	type: undefined as unknown as string,
	payload: undefined
}

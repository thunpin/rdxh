import {newAsyncAction} from './newAsyncAction'
import {defaultAsyncState} from './model/state'

describe('newAsyncAction', () => {
    test('should contains the type', () => {
        const myAction = newAsyncAction('@my-newAsyncAction')
        expect(myAction.type).toBe('@my-newAsyncAction')
    })
    test('should contains the success type', () => {
        const myAction = newAsyncAction('@my-newAsyncAction')
        expect(myAction.successType).toBe('@my-newAsyncAction::success')
    })
    test('should contains the failed type', () => {
        const myAction = newAsyncAction('@my-newAsyncAction')
        expect(myAction.failedType).toBe('@my-newAsyncAction::failed')
    })
    test('should contains the reset type', () => {
        const myAction = newAsyncAction('@my-newAsyncAction')
        expect(myAction.resetType).toBe('@my-newAsyncAction::reset')
    })
    test('should contains the type', () => {
        const myAction = newAsyncAction('@my-newAsyncAction')
        expect(myAction.type).toBe('@my-newAsyncAction')
    })
    test('should return an Action', () => {
        const myAction = newAsyncAction<number, any>('@my-newAsyncAction-number')
        expect(myAction(20)).toEqual({type: '@my-newAsyncAction-number', payload: 20})
    })
    test('should return success Action', () => {
        const myAction = newAsyncAction<number, string>('@my-newAsyncAction-result')
        const result = 'success'
        expect(myAction.success(result)).toEqual({type: '@my-newAsyncAction-result::success', payload: result})
    })
    test('should return failed Action', () => {
        const myAction = newAsyncAction<number, string>('@my-newAsyncAction-error')
        const error = new Error('my-error')
        expect(myAction.failed(error)).toEqual({type: '@my-newAsyncAction-error::failed', payload: error})
    })
    test('should return resetFailed Action', () => {
        const myAction = newAsyncAction<number, string>('@my-reset-failed')
        expect(myAction.resetFailed()).toEqual({type: '@my-reset-failed::resetFailed', payload: undefined})
    })
    test('should returns defaultAction', () => {
        const myAction = newAsyncAction<number, any>('@my-newAsyncAction-number')
        expect(myAction.reset()).toEqual({type: '@my-newAsyncAction-number::reset', payload: undefined})
    })
    test('should convert reduxState to State', () => {
        const myAction = newAsyncAction<number, number>('@my-to-state')
        const reduxState = {'@my-to-state': {content: 20}}
        expect(myAction.toState(reduxState)).toEqual({content: 20})
    })
    test('should return default state if reduxState not contains the state', () => {
        const myAction = newAsyncAction<number, number>('@my-to-state-wrong')
        const reduxState = {'@my-to-state': {content: 20}}
        expect(myAction.toState(reduxState)).toEqual(defaultAsyncState)
    })
    test('should create an object to add on combineReducer', () => {
        const myAction = newAsyncAction<number, number>('@my-combined-reducer')
        expect(myAction.toCombineReducer[myAction.type]).toEqual(myAction.reducer)
    })
    describe('reducer', () => {
        test('should return the default state', () => {
            const myAction = newAsyncAction('@my-newAsyncAction-number-with-reducer')
            expect(myAction.reducer()).toEqual(defaultAsyncState)
        })
        test('should return the current state', () => {
            const myAction = newAsyncAction('@my-newAsyncAction-number-with-reducer')
            const currentState = {...defaultAsyncState, content: 10}
            expect(myAction.reducer(currentState)).toEqual({...defaultAsyncState, content: 10})
        })
        test('should change to isLoading', () => {
            const myAction = newAsyncAction('@my-newAsyncAction-number-with-reducer')
            const state = {...defaultAsyncState, hasError: true}
            expect(myAction.reducer(state, myAction(10))).toEqual({...state, isLoading: true})
        })
        test('should return the new content ', () => {
            const myAction = newAsyncAction('@my-newAsyncAction-number-with-reducer')
            const state = {...defaultAsyncState, isLoading: true, hasError: true}
            expect(myAction.reducer(state, myAction.success(10))).toEqual({...defaultAsyncState, content: 10})
        })
        test('should return the error ', () => {
            const myAction = newAsyncAction('@my-newAsyncAction-number-with-reducer')
            const error = new Error('my-error')
            const state = {...defaultAsyncState, isLoading: true, content: 20}
            expect(myAction.reducer(state, myAction.failed(error))).toEqual({
                ...defaultAsyncState,
                hasError: true,
                error,
                content: 20
            })
        })
        test('should clear the error ', () => {
            const myAction = newAsyncAction('@my-newAsyncAction-number-with-reducer')
            const error = new Error('my-error')
            const state = {...defaultAsyncState, hasError: true, error, content: 20}
            expect(myAction.reducer(state, myAction.resetFailed())).toEqual({...defaultAsyncState, content: 20})
        })
        test('should return the default state after reset', () => {
            const myAction = newAsyncAction('@my-newAsyncAction-number-with-reducer')
            const currentState = {...defaultAsyncState, content: 10}
            expect(myAction.reducer(currentState, myAction.reset())).toEqual({...defaultAsyncState, content: undefined})
        })
    })
    test('should replace the execute state', () => {
        const myAction = newAsyncAction('@my-newAsyncAction-number-with-reducer', () => defaultAsyncState)
        const state = {...defaultAsyncState, hasError: true}
        expect(myAction.reducer(state, myAction(10))).toEqual(defaultAsyncState)
    })
})

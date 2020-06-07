import {newAsyncAction} from './newAsyncAction'
import {defaultAsyncState} from './model/state'

describe('newAsyncAction', () => {
    test('should contains the type', () => {
        const myAction = newAsyncAction('@my-newAsyncAction', () => {
        })
        expect(myAction.type).toBe('@my-newAsyncAction')
    })
    test('should return an Action', () => {
        const myAction = newAsyncAction<number, any>('@my-newAsyncAction-number', () => {
        })
        expect(myAction(20)).toEqual({type: '@my-newAsyncAction-number::execute', payload: 20})
    })
    test('should return success Action', () => {
        const myAction = newAsyncAction<number, string>('@my-newAsyncAction-result', () => '')
        const result = 'success'
        expect(myAction.success(result)).toEqual({type: '@my-newAsyncAction-result::success', payload: result})
    })
    test('should return failed Action', () => {
        const myAction = newAsyncAction<number, string>('@my-newAsyncAction-error', () => '')
        const error = new Error('my-error')
        expect(myAction.failed(error)).toEqual({type: '@my-newAsyncAction-error::failed', payload: error})
    })
    test('should returns defaultAction', () => {
        const myAction = newAsyncAction<number, any>('@my-newAsyncAction-number', () => {
        })
        expect(myAction.reset()).toEqual({type: '@my-newAsyncAction-number::reset', payload: undefined})
    })
    test('should convert reduxState to State', () => {
        const myAction = newAsyncAction<number, number>('@my-to-state', value => value)
        const reduxState = {'@my-to-state': {content: 20}}
        expect(myAction.toState(reduxState)).toEqual({content: 20})
    })
    test('should return default state if reduxState not contains the state', () => {
        const myAction = newAsyncAction<number, number>('@my-to-state-wrong', value => value)
        const reduxState = {'@my-to-state': {content: 20}}
        expect(myAction.toState(reduxState)).toEqual(defaultAsyncState)
    })
    test('should create an object to add on combineReducer', () => {
        const myAction = newAsyncAction<number, number>('@my-combined-reducer', value => value)
        expect(myAction.toCombineReducer[myAction.type]).toEqual(myAction.reducer)
    })
    describe('reducer', () => {
        test('should return the content', () => {
            const myAction = newAsyncAction('@my-newAsyncAction-number-with-reducer', value => value)
            expect(myAction.reducer(undefined, myAction(10))).toEqual({...defaultAsyncState, content: 10})
        })
        test('should return the default state', () => {
            const myAction = newAsyncAction('@my-newAsyncAction-number-with-reducer', value => value)
            expect(myAction.reducer()).toEqual(defaultAsyncState)
        })
        test('should return the current state', () => {
            const myAction = newAsyncAction('@my-newAsyncAction-number-with-reducer', value => value)
            const currentState = {...defaultAsyncState, content: 10}
            expect(myAction.reducer(currentState)).toEqual({...defaultAsyncState, content: 10})
        })
        test('should return the default state after reset', () => {
            const myAction = newAsyncAction('@my-newAsyncAction-number-with-reducer', value => value)
            const currentState = {...defaultAsyncState, content: 10}
            expect(myAction.reducer(currentState, myAction.reset())).toEqual({...defaultAsyncState, content: undefined})
        })
    })
})

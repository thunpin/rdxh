import {newAction} from './newAction'

describe('newAction', () => {
    test('should contains the type', () => {
        const myAction = newAction('@my-newAction', () => '')
        expect(myAction.type).toBe('@my-newAction')
    })
    test('should return an Action', () => {
        const myAction = newAction<number, any>('@my-newAction-number', () => 'any-value')
        expect(myAction(20)).toEqual({type: '@my-newAction-number', payload: 20})
    })
    test('should returns defaultAction', () => {
        const myAction = newAction<number, any>('@my-newAction-number', () => ({}))
        expect(myAction.reset()).toEqual({type: '@my-newAction-number::reset', payload: undefined})
    })
    test('should convert reduxState to State', () => {
        const myAction = newAction<number, number>('@my-to-state', value => value)
        const reduxState = {'@my-to-state': {content: 20}}
        expect(myAction.toState(reduxState)).toEqual({content: 20})
    })
    test('should return default state if reduxState not contains the state', () => {
        const myAction = newAction<number, number>('@my-to-state-wrong', value => value)
        const reduxState = {'@my-to-state': {content: 20}}
        expect(myAction.toState(reduxState).content).toBeUndefined()
    })
    test('should create an object to add on combineReducer', () => {
        const myAction = newAction<number, number>('@my-combined-reducer', value => value)
        expect(myAction.toCombineReducer[myAction.type]).toEqual(myAction.reducer)
    })
    describe('reducer', () => {
        test('should return the content', () => {
            const myAction = newAction('@my-newAction-number-with-reducer', value => value)
            expect(myAction.reducer(undefined, myAction(10)).content).toEqual(10)
        })
        test('should return the default state', () => {
            const myAction = newAction('@my-newAction-number-with-reducer', value => value)
            expect(myAction.reducer().content).toBeUndefined()
        })
        test('should return the current state', () => {
            const myAction = newAction('@my-newAction-number-with-reducer', value => value)
            const currentState = {content: 10}
            expect(myAction.reducer(currentState)).toEqual({content: 10})
        })
        test('should return the default state after reset', () => {
            const myAction = newAction('@my-newAction-number-with-reducer', value => value)
            const currentState = {content: 10}
            expect(myAction.reducer(currentState, myAction.reset()).content).toBeUndefined()
        })
    })
})

# Redux Helper

Helper to reduce the redux code boilerplate.

## Install

`npm i rdxh`

## How to Use

### newAction
standard redux calls

**on the _store_ level**
```typescript
import {newAction} from 'rdxh'

const setLanguage = newAction('@myApp/myPkg/setLanguage', (language: string) => language)
const addLanguage = newAction('@myApp/myPkg/addLanguage', 
    (language: string, languages: string[]) => [...languages, language]
)

const rootReducer = combineReducers({
    ...setLanguage.toCombineReducer,
    ...addLanguage.toCombineReducer
})
```
**on the _epic_ level**
```typescript
import {Action} from 'rdxh'

export const addLanguageEpic = (
action$: ActionsObservable<Action<string>>,
state$: StateObservable<any>): Observable<any> =>
    action$.pipe(
        ofType(addLanguage.type),
        switchMap(action => {
            const newLanguage = action.content
            // can use state$.source + switchMap also
            const languages = addLanguage.toState(state$.value) 
            /* ... your code ... */
        })
  )
```
**on the _react_ level**
```typescript
const mapState = (reduxState: any) => ({
    language: setLanguage.toState(reduxState).content,
    languages: addLanguage.toState(reduxState).content
})

const mapDispatch = {
    setLanguage: setLanguage,
    removeLanguage: setLanguage.reset,
    addLanguage: addLanguage,
    emptyLanguages: addLanguage.reset,
}
```


### newAsyncAction
useful on async redux calls

**on the _store_ level**
```typescript
import {newAsyncAction} from 'rdxh'

const getUser = newAsyncAction<number, User>('@myApp/myPkg/setLanguage')

const rootReducer = combineReducers({...getUser.toCombineReducer})
```
**on the _epic_ level**
```typescript
import {Action} from 'rdxh'

export const getUserEpic = (
action$: ActionsObservable<Action<number>>,
state$: StateObservable<any>,
Service: service): Observable<any> =>
    action$.pipe(
        ofType(addLanguage.type),
        switchMap(action => service.getUser$(action.payload).pipe(
            map((user:User) => getUser.success(user)),
            catchError((error: Error) => of(getUser.failed(error)))
        ))
    )
```
**on the _react_ level**
```typescript
const mapState = (reduxState: any) => ({
    user: getUser.toState(reduxState).content,
    error: getUser.toState(reduxState).error,
    hasError: getUser.toState(reduxState).hasError,
    isLoading: getUser.toState(reduxState).isLoading,
})

const mapDispatch = {
    getUser: getUser,
    clearError: getUser.resetError
}
```
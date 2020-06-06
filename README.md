# Redux Helper
Helper to reduce the redux boilerplate typescript code.

## MinRdxh
Provided a simple redux call to store and clear a content.

### How to use

**On _store_ level**

```typescript
import {minRdxhBuild} from 'src/rdxMinBuild'

export const setLanguage = minRdxhBuild<string>('@example/setLanguage').build()

export const reducer = combineReducers({ ...setLanguage.toCombineReducer })
```

**On _epic_ level**
```typescript
export const setLanguageEpic =
    (rdx$: ActionsObservable<Action<string>>, state$: StateObservable<any>): Observable<any> =>
        rdx$.pipe(
            ofType(setLanguage.types.execute),
            switchMap(rdx => {
                state$.source.pipe(
                    map(state: any => setLanguage.toState(state)),
                    map(language: string => /* your logic */)
                )
            })
        )
```

**On _react_ level**
```typescript
const mapState = (reduxState: any) => ({
    language: setLanguage.toState(reduxState).content,
})

const mapDispatch = {
    setLanguage: setLanguage.actions.execute
}
```

## StdRdxh
Provided a standard redux call with a defined result

### How to use

**On _store_ level**

```typescript
import {stdRdxhBuild} from 'src/rdx'

const addLanguageFunction = (state: State<string[]>, rdx: Action<string>): State<string[]> =>
            ({content: [...state.content, rdx.payload]})
export const addLanguage = stdRdxhBuild<string, []string>('@example/addLanguage')
    .execute(addLanguageFunction)
    .build()

export const reducer = combineReducers({ ...addLanguage.toCombineReducer })
```

**On _epic_ level**
```typescript
export const addLanguageEpic =
    (rdx$: ActionsObservable<Action<string>>, state$: StateObservable<any>): Observable<any> =>
        rdx$.pipe(
            ofType(addLanguage.types.execute),
            switchMap(rdx => 
                state$.source.pipe(
                    map(state: any => addLanguage.toState(state)),
                    map(languages: string[] => /* your logic */)
                    /* business logic */
                )
            )
        )
```

**On _react_ level**
```typescript
const mapState = (reduxState: any) => ({
    languages: addLanguage.toState(reduxState).content,
})

const mapDispatch = {
    addLanguage: addLanguage.actions.execute
}
```

## SynRdxh
Provide a complex redux use case to sync calls

### How to use

**On _store_ level**

```typescript
import {syncRdxhBuild} from 'src/rdxSyncBuild'

export const addLanguage = syncRdxhBuild<string, string[]>('@example/addLanguage').build()

export const reducer = combineReducers({ ...addLanguage.toCombineReducer })
```

**On _epic_ level**
```typescript
export const addLanguageEpic =
    (rdx$: ActionsObservable<Action<string>>, state$: StateObservable<any>): Observable<any> =>
        rdx$.pipe(
            ofType(addLanguage.types.execute),
            switchMap(rdx => state$.source.pipe(
                switchMap(() => validateLanguage(rdx.payload)),
                map(state: any => addLanguage.toState(state)),
                map(languages: string[] => addLanguage.actions.success([...languages, rdx.payload])),
                catchError(error => of(addLanguage.actions.failed(error)))
            ))
        )
```

**On _react_ level**
```typescript
const mapState = (reduxState: any) => ({
    languages: addLanguage.toState(reduxState).content,
    error: addLanguage.toState(reduxState).error,
    hasError: addLanguage.toState(reduxState).hasError,
})

const mapDispatch = {
    addLanguage: addLanguage.actions.execute
}
```

## AsynRdxh
Provide a complex redux use case to sync calls

### How to use

**On _store_ level**

```typescript
import {asyncRdxhBuild} from 'src/rdxAsyncBuild'

export const addLanguage = asyncRdxhBuild<string, string[]>('@example/addLanguage').build()

export const reducer = combineReducers({ ...addLanguage.toCombineReducer })
```

**On _epic_ level**
```typescript
export const addLanguageEpic =
    (rdx$: ActionsObservable<Action<string>>, state$: StateObservable<any>, service: Service): Observable<any> =>
        rdx$.pipe(
            ofType(addLanguage.types.execute),
            switchMap(rdx => service.doSomething().pipe(
                state$.source.pipe(
                    switchMap(() => validateLanguage(rdx.payload)),
                    map(state: any => addLanguage.toState(state)),
                    map(languages: string[] => addLanguage.actions.success([...languages, rdx.payload])),
                    catchError(error => of(addLanguage.actions.failed(error)))
                ))
            )
        )
```

**On _react_ level**
```typescript
const mapState = (reduxState: any) => ({
    languages: addLanguage.toState(reduxState).content,
    error: addLanguage.toState(reduxState).error,
    hasError: addLanguage.toState(reduxState).hasError,
    isLoading: addLanguage.toState(reduxState).isLoading,
})

const mapDispatch = {
    addLanguage: addLanguage.actions.execute
}
```

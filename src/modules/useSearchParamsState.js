// see: https://blog.logrocket.com/use-state-url-persist-state-usesearchparams/
import { useSearchParams } from 'react-router-dom'

export default function useSearchParamsState(searchParamName, defaultValue) {
  const [searchParams, setSearchParams] = useSearchParams()

  let acquiredSearchParam
  let searchParamsState
  if (defaultValue instanceof Array) {
    acquiredSearchParam = searchParams.getAll(searchParamName)
    searchParamsState =
      acquiredSearchParam.length > 0 ? acquiredSearchParam : defaultValue
  } else {
    acquiredSearchParam = searchParams.get(searchParamName)
    searchParamsState = acquiredSearchParam ? acquiredSearchParam : defaultValue
  }

  // console.log('useSearchParamsState', {
  //   acquiredSearchParam,
  //   searchParamsState,
  //   searchParamName,
  //   defaultValue,
  //   searchParamsEntries: [...searchParams.entries()],
  // })

  const setSearchParamsState = (newState) => {
    const previous = [...searchParams.entries()].reduce((o, [key, value]) => {
      if (key in o) {
        if (o[key] instanceof Array) {
          return { ...o, [key]: [...o[key], value] }
        }
        return { ...o, [key]: [o[key], value] }
      } else {
        return { ...o, [key]: value }
      }
    }, {})
    const next = Object.assign({}, previous, { [searchParamName]: newState })
    setSearchParams(next)
  }
  return [searchParamsState, setSearchParamsState]
}

// How to use:
// const [greeting, setGreeting] = useSearchParamsState("greeting", "hello");

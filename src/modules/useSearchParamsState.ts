// see: https://blog.logrocket.com/use-state-url-persist-state-usesearchparams/
import { useSearchParams } from 'react-router'

import { projekteTabsSortFunction } from './projekteTabsSortFunction.ts'

export function useSearchParamsState<T extends string | string[]>(
  searchParamName: string,
  defaultValue: T,
) {
  const [searchParams, setSearchParams] = useSearchParams()

  let acquiredSearchParam
  let searchParamsState: T
  if (defaultValue instanceof Array) {
    acquiredSearchParam = searchParams.getAll(searchParamName)
    searchParamsState =
      acquiredSearchParam.length > 0 ? (acquiredSearchParam as T) : defaultValue
  } else {
    acquiredSearchParam = searchParams.get(searchParamName)
    searchParamsState = acquiredSearchParam ? (acquiredSearchParam as T) : defaultValue
  }

  const setSearchParamsState = (newState: T) => {
    // ensure projekteTabs sort order
    if (searchParamName === 'projekteTabs') {
      ;(newState as string[]).sort(projekteTabsSortFunction)
    }
    const previous = [...searchParams.entries()].reduce<Record<string, unknown>>(
      (o, [key, value]) => {
        if (key in o) {
          if (o[key] instanceof Array) {
            return { ...o, [key]: [...(o[key] as unknown[]), value] }
          }
          return { ...o, [key]: [o[key], value] }
        } else {
          return { ...o, [key]: value }
        }
      },
      {},
    )
    const next = Object.assign({}, previous, { [searchParamName]: newState })
    setSearchParams(next)
  }
  return [searchParamsState, setSearchParamsState] as const
}

// How to use:
// const [greeting, setGreeting] = useSearchParamsState("greeting", "hello");

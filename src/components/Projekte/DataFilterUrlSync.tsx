import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router'
import { useAtomValue, useSetAtom, useStore } from 'jotai'

import {
  dataFilterParamName,
  decodeDataFilterParam,
  encodeDataFilterParam,
} from '../../modules/dataFilterParam.ts'
import { addNotificationAtom, treeDataFilterAtom } from '../../store/index.ts'

/**
 * keeps the working data filter linkable in the url via ?f= (sparse
 * json, base64url): written on every committed change (fields commit on
 * blur/select, so writes are interaction-frequency, not per
 * keystroke), removed when the filter is empty. Copying the url
 * therefore always shares the exact view. On mount the param wins over
 * the value persisted in localStorage.
 */
export const DataFilterUrlSync = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const targetStore = useStore()
  const dataFilter = useAtomValue(treeDataFilterAtom)
  const addNotification = useSetAtom(addNotificationAtom)

  const fParam = searchParams.get(dataFilterParamName)
  const settled = useRef(false)
  const firstChangeRun = useRef(true)

  const removeParam = (name: string) => {
    setSearchParams(
      (prev) => {
        if (!prev.has(name)) return prev
        const next = new URLSearchParams(prev)
        next.delete(name)
        return next
      },
      { replace: true },
    )
  }

  // on mount: apply the filter the url points to, then complete the url
  // with the now-effective filter (read from the store because this
  // render's subscribed values are pre-seed). Declared before the
  // change effect so that one skips its own stale first run
  useEffect(() => {
    if (fParam !== null) {
      const decoded = decodeDataFilterParam(fParam)
      if (decoded) {
        targetStore.set(treeDataFilterAtom, decoded)
      } else {
        addNotification({
          message: 'Der Filter-Link ist ungültig',
          options: { variant: 'error' },
        })
        removeParam(dataFilterParamName)
      }
    }
    const effective = targetStore.get(treeDataFilterAtom)
    const encoded = encodeDataFilterParam(effective)
    if (encoded !== null && encoded !== fParam) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set(dataFilterParamName, encoded)
          return next
        },
        { replace: true },
      )
    }
    settled.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // keep the url current after every change. Its first run happens in
  // the same commit as the mount effect above, with pre-seed (stale)
  // subscribed values — skip exactly that one run
  useEffect(() => {
    if (firstChangeRun.current) {
      firstChangeRun.current = false
      return
    }
    if (!settled.current) return
    const encoded = encodeDataFilterParam(dataFilter)
    if (encoded === null) {
      // an empty filter carries no f
      if (fParam !== null) removeParam(dataFilterParamName)
      return
    }
    // write whenever the url does not carry the current filter — a
    // navigation racing this write (params set from handlers evaluate
    // against the last committed search) may have dropped it, so this
    // reconciles on every search change, not only on filter changes
    if (fParam !== encoded) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set(dataFilterParamName, encoded)
          return next
        },
        { replace: true },
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataFilter, searchParams])

  return null
}

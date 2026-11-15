import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router'
import { useAtomValue, useSetAtom, useStore } from 'jotai'
import { useQuery } from '@tanstack/react-query'
import { isEqual } from 'es-toolkit'

import { apiFetch } from '../../modules/api.ts'
import { sanitizeDataFilter } from '../../modules/sanitizeDataFilter.ts'
import {
  dataFilterParamName,
  decodeDataFilterParam,
  encodeDataFilterParam,
} from '../../modules/dataFilterParam.ts'
import {
  savedFilterParamName,
  setSavedFilterParam,
} from '../../modules/savedFilterParam.ts'
import {
  addNotificationAtom,
  treeDataFilterAtom,
} from '../../store/index.ts'
import { initialDataFilterValues } from '../../store/initialDataFilterValues.ts'
import type SavedFilter from '../../models/apflora/SavedFilter.ts'

/**
 * keeps the working data filter linkable in the url:
 * - ?f= carries the filter itself (sparse json, base64url) — written on
 *   every committed change (fields commit on blur/select, so writes are
 *   interaction-frequency, not per keystroke), removed when the filter
 *   is empty. Copying the url therefore always shares the exact view.
 * - ?savedFilter=<id> is a load instruction and origin marker: on load,
 *   f wins if both are present; applying a saved filter (or saving one)
 *   keeps the id so the Filter panel can offer aktualisieren/löschen.
 * - with neither param, the filter comes from localStorage.
 * The Filter panel applies loaded/saved filters itself before setting
 * the param; this component covers links and reloads.
 */
export const DataFilterUrlSync = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const targetStore = useStore()
  const dataFilter = useAtomValue(treeDataFilterAtom)
  const addNotification = useSetAtom(addNotificationAtom)

  const fParam = searchParams.get(dataFilterParamName)
  const savedFilterId = searchParams.get(savedFilterParamName)
  const appliedSavedId = useRef<string | null>(null)
  const settled = useRef(false)
  const firstChangeRun = useRef(true)

  const { data, error } = useQuery({
    queryKey: ['savedFilter', savedFilterId],
    queryFn: () =>
      apiFetch<SavedFilter[]>(
        `/saved_filter?id=eq.${savedFilterId}&select=id,name,filter`,
      ),
    // f carries the exact state — the saved filter is only an origin
    // marker then, nothing to fetch
    enabled: !!savedFilterId && !fParam,
    staleTime: 60 * 60 * 1000,
  })

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

  const writeFParam = (encoded: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set(dataFilterParamName, encoded)
        return next
      },
      { replace: true },
    )
  }

  // on mount: f wins over the saved filter, which wins over the stored
  // value. Then complete the url with the now-effective filter (read
  // from the store because this render's subscribed values are
  // pre-seed). Declared before the change effect so that one skips its
  // own stale first run
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
      // the saved filter id stays as origin marker without being fetched
      appliedSavedId.current = savedFilterId
    }
    // complete the url with the effective filter
    const effective = targetStore.get(treeDataFilterAtom)
    const encoded = encodeDataFilterParam(effective)
    if (encoded !== null && encoded !== fParam) writeFParam(encoded)
    settled.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // apply the saved filter the url points to (only without f, which has
  // already been applied). The appliedSavedId ref keeps this from
  // re-applying (and overwriting user modifications)
  useEffect(() => {
    if (!savedFilterId || fParam) return
    if (appliedSavedId.current === savedFilterId) return
    if (error) {
      addNotification({
        message: 'Der gespeicherte Filter konnte nicht geladen werden',
        options: { variant: 'error' },
      })
      appliedSavedId.current = savedFilterId
      removeParam(savedFilterParamName)
      return
    }
    if (!data) return
    const row = data[0]
    appliedSavedId.current = savedFilterId
    if (!row) {
      addNotification({
        message: 'Der gespeicherte Filter existiert nicht (mehr)',
        options: { variant: 'error' },
      })
      removeParam(savedFilterParamName)
      return
    }
    targetStore.set(treeDataFilterAtom, sanitizeDataFilter(row.filter))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedFilterId, fParam, data, error])

  // keep the url current after every change. Its first run happens in
  // the same commit as the mount effect above, with pre-seed (stale)
  // subscribed values — skip exactly that one run
  useEffect(() => {
    if (firstChangeRun.current) {
      firstChangeRun.current = false
      return
    }
    if (!settled.current) return
    if (isEqual(dataFilter, initialDataFilterValues)) {
      // an empty filter carries no f — and detaches the saved filter
      appliedSavedId.current = null
      if (fParam !== null) removeParam(dataFilterParamName)
      if (savedFilterId) {
        setSearchParams(
          (prev) => setSavedFilterParam(prev, null),
          { replace: true },
        )
      }
      return
    }
    const encoded = encodeDataFilterParam(dataFilter)
    // write whenever the url does not carry the current filter — a
    // navigation racing this write (params set from handlers evaluate
    // against the last committed search) may have dropped it, so this
    // reconciles on every search change, not only on filter changes
    if (encoded !== null && fParam !== encoded) {
      writeFParam(encoded)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataFilter, searchParams])

  return null
}

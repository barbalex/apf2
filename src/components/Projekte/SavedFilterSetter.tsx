import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router'
import { useAtomValue, useSetAtom, useStore } from 'jotai'
import { useQuery } from '@tanstack/react-query'
import { isEqual } from 'es-toolkit'

import { apiFetch } from '../../modules/api.ts'
import { sanitizeDataFilter } from '../../modules/sanitizeDataFilter.ts'
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
 * applies the saved filter the ?savedFilter= param points to, so filter
 * views are linkable: on entering /Daten/Projekte with the param (a
 * shared link, a reload) the filter row is fetched and sanitized into
 * treeDataFilterAtom. The Filter panel's load/save actions set the param
 * (and apply directly); this component covers links and reloads.
 * When the working filter is emptied back to the initial values, the
 * param is removed — the saved filter is detached.
 */
export const SavedFilterSetter = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const targetStore = useStore()
  const dataFilter = useAtomValue(treeDataFilterAtom)
  const addNotification = useSetAtom(addNotificationAtom)

  const savedFilterId = searchParams.get(savedFilterParamName)
  const appliedId = useRef<string | null>(null)

  const { data, error } = useQuery({
    queryKey: ['savedFilter', savedFilterId],
    queryFn: () =>
      apiFetch<SavedFilter[]>(
        `/saved_filter?id=eq.${savedFilterId}&select=id,name,filter`,
      ),
    enabled: !!savedFilterId,
    staleTime: 60 * 60 * 1000,
  })

  const detach = () => {
    appliedId.current = null
    setSearchParams(
      (prev) => setSavedFilterParam(prev, null),
      { replace: true },
    )
  }

  // apply the filter the url points to. The Filter panel applies loaded
  // filters itself before setting the param — the appliedId ref keeps
  // this from re-applying (and overwriting user modifications) on every
  // render
  useEffect(() => {
    if (!savedFilterId || appliedId.current === savedFilterId) return
    if (error) {
      addNotification({
        message: 'Der gespeicherte Filter konnte nicht geladen werden',
        options: { variant: 'error' },
      })
      appliedId.current = savedFilterId
      detach()
      return
    }
    if (!data) return
    const row = data[0]
    appliedId.current = savedFilterId
    if (!row) {
      addNotification({
        message: 'Der gespeicherte Filter existiert nicht (mehr)',
        options: { variant: 'error' },
      })
      detach()
      return
    }
    targetStore.set(treeDataFilterAtom, sanitizeDataFilter(row.filter))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedFilterId, data, error])

  // a filter emptied back to the initial values detaches the saved filter
  useEffect(() => {
    if (!savedFilterId) return
    if (appliedId.current !== savedFilterId) return
    if (isEqual(dataFilter, initialDataFilterValues)) detach()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataFilter, savedFilterId])

  return null
}

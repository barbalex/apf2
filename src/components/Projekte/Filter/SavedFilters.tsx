import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { useAtomValue, useSetAtom, useStore } from 'jotai'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import MuiSelect from '@mui/material/Select'
import TextField from '@mui/material/TextField'

import { apiDelete, apiFetch, apiUpdate } from '../../../modules/api.ts'
import { sanitizeDataFilter } from '../../../modules/sanitizeDataFilter.ts'
import { setSavedFilterParam } from '../../../modules/savedFilterParam.ts'
import {
  addNotificationAtom,
  treeDataFilterAtom,
  treeDataFilterEmptyAtom,
  userCanSaveFiltersAtom,
  userNameAtom,
  userRoleAtom,
} from '../../../store/index.ts'
import type SavedFilter from '../../../models/apflora/SavedFilter.ts'

import styles from './SavedFilters.module.css'

/**
 * save/load bar for the complete data filter (all tabs of the Filter
 * panel at once): saved filters live in apflora.saved_filter and are
 * linkable via ?savedFilter=<id>. Loading applies the filter and points
 * the url at it; emptying the filter detaches it again
 * (SavedFilterSetter). Everyone may load; saving is for the writing
 * roles; overwriting/deleting for the owner (or managers).
 */
export const SavedFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const targetStore = useStore()
  const queryClient = useQueryClient()
  const dataFilter = useAtomValue(treeDataFilterAtom)
  const userName = useAtomValue(userNameAtom)
  const userRole = useAtomValue(userRoleAtom)
  const canSaveFilters = useAtomValue(userCanSaveFiltersAtom)
  const addNotification = useSetAtom(addNotificationAtom)
  const [newName, setNewName] = useState('')

  const activeId = searchParams.get('savedFilter')

  const { data: savedFilters } = useQuery({
    queryKey: ['savedFilter'],
    queryFn: () =>
      apiFetch<SavedFilter[]>(
        '/saved_filter?select=id,name,created_by,updated_at&order=name',
      ),
  })

  const activeFilter = savedFilters?.find((f) => f.id === activeId)
  const canEditActive =
    !!activeFilter &&
    (activeFilter.created_by === userName || userRole === 'apflora_manager')

  const saveMutation = useMutation({
    // return=representation to get the new row's id for the url
    mutationFn: async () => {
      const rows = await apiFetch<SavedFilter[]>('/saved_filter', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify([{ name: newName, filter: dataFilter }]),
      })
      return rows?.[0]
    },
    onSuccess: (row) => {
      setNewName('')
      addNotification({ message: 'Filter gespeichert' })
      if (row) {
        setSearchParams((prev) => setSavedFilterParam(prev, row.id), {
          replace: true,
        })
      }
      void queryClient.invalidateQueries({ queryKey: ['savedFilter'] })
    },
    onError: () =>
      addNotification({
        message: 'Der Filter konnte nicht gespeichert werden',
        options: { variant: 'error' },
      }),
  })

  const updateMutation = useMutation({
    mutationFn: () =>
      apiUpdate('saved_filter', activeId ?? '', { filter: dataFilter }),
    onSuccess: () => {
      addNotification({ message: 'Filter aktualisiert' })
      void queryClient.invalidateQueries({ queryKey: ['savedFilter'] })
    },
    onError: () =>
      addNotification({
        message: 'Der Filter konnte nicht aktualisiert werden',
        options: { variant: 'error' },
      }),
  })

  const deleteMutation = useMutation({
    mutationFn: () => apiDelete('saved_filter', activeId ?? ''),
    onSuccess: () => {
      addNotification({ message: 'Filter gelöscht' })
      setSearchParams((prev) => setSavedFilterParam(prev, null), {
        replace: true,
      })
      void queryClient.invalidateQueries({ queryKey: ['savedFilter'] })
    },
    onError: () =>
      addNotification({
        message: 'Der Filter konnte nicht gelöscht werden',
        options: { variant: 'error' },
      }),
  })

  const onLoad = (id: string) => {
    // the list query selects no filter column - fetch the full row
    void apiFetch<SavedFilter[]>(
      `/saved_filter?id=eq.${id}&select=id,name,filter`,
    ).then((rows) => {
      const full = rows?.[0]
      if (!full) return
      targetStore.set(treeDataFilterAtom, sanitizeDataFilter(full.filter))
      setSearchParams((prev) => setSavedFilterParam(prev, id), {
        replace: true,
      })
    })
  }

  const onCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    addNotification({ message: 'Link kopiert' })
  }

  const onEmpty = () => {
    targetStore.set(treeDataFilterEmptyAtom)
  }

  return (
    <div className={styles.container}>
      <FormControl
        className={styles.select}
        size="small"
      >
        <InputLabel id="saved-filters-label">Gespeicherte Filter</InputLabel>
        <MuiSelect
          labelId="saved-filters-label"
          label="Gespeicherte Filter"
          value={activeId ?? ''}
          onChange={(event) => onLoad(event.target.value as string)}
        >
          {(savedFilters ?? []).map((filter) => (
            <MenuItem
              key={filter.id}
              value={filter.id}
            >{`${filter.name} (${filter.created_by})`}</MenuItem>
          ))}
        </MuiSelect>
      </FormControl>
      {canSaveFilters && (
        <TextField
          label="Neuer Filter-Name"
          name="newFilterName"
          size="small"
          className={styles.nameField}
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
        />
      )}
      {canSaveFilters && (
        <Button
          color="inherit"
          disabled={!newName || saveMutation.isPending}
          onClick={() => saveMutation.mutate()}
        >
          speichern
        </Button>
      )}
      {activeFilter && canEditActive && (
        <Button
          color="inherit"
          disabled={updateMutation.isPending}
          onClick={() => updateMutation.mutate()}
        >
          aktualisieren
        </Button>
      )}
      {activeFilter && (
        <Button
          color="inherit"
          onClick={() => void onCopyLink()}
        >
          Link kopieren
        </Button>
      )}
      {activeFilter && canEditActive && (
        <Button
          color="inherit"
          disabled={deleteMutation.isPending}
          onClick={() => deleteMutation.mutate()}
        >
          löschen
        </Button>
      )}
      <Button
        color="inherit"
        onClick={onEmpty}
      >
        alle Filter leeren
      </Button>
    </div>
  )
}

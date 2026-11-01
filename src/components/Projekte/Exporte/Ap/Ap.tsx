import { useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import Button from '@mui/material/Button'

import { apiFetch } from '../../../../modules/api.ts'
import { exportModule } from '../../../../modules/export.ts'
import { tableIsFiltered } from '../../../../modules/tableIsFiltered.ts'

import type { ApId } from '../../../../models/apflora/index.ts'

import styles from '../index.module.css'

import {
  addNotificationAtom,
  treeApGqlFilterAtom,
} from '../../../../store/index.ts'

interface ApProps {
  filtered?: boolean
}

export const Ap = ({ filtered = false }: ApProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const apGqlFilter = useAtomValue(treeApGqlFilterAtom)

  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickAp = async () => {
    setQueryState('lade Daten...')
    let nodes:
      | {
          id: ApId
          start_jahr: number | null
          created_at: string | null
          updated_at: string | null
          changed_by: string | null
          bearbeiter: string | null
          ae_taxonomy_by_art_id: { artname: string | null } | null
          ap_bearbstand_werte_by_bearbeitung: { text: string | null } | null
          ap_umsetzung_werte_by_umsetzung: { text: string | null } | null
          adresse_by_bearbeiter: { name: string | null } | null
        }[]
      | undefined
    try {
      // v_ap carries the werte/artname/adresse jsonbs the export embeds.
      // filtered: the cascade filter runs through query_ap first
      const select =
        'id,start_jahr,created_at,updated_at,changed_by,bearbeiter,ae_taxonomy_by_art_id,ap_bearbstand_werte_by_bearbeitung,ap_umsetzung_werte_by_umsetzung,adresse_by_bearbeiter'
      if (filtered) {
        const ids =
          (await apiFetch<{ id: ApId }[]>('/rpc/query_ap?select=id', {
            method: 'POST',
            body: JSON.stringify({ p_filter: apGqlFilter.filtered }),
          })) ?? []
        nodes =
          ids.length ?
            ((await apiFetch(
              `/v_ap?id=in.(${ids.map((r) => r.id).join(',')})&select=${select}`,
            )) ?? [])
          : []
      } else {
        nodes = (await apiFetch(`/v_ap?select=${select}`)) ?? []
      }
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    setQueryState('verarbeite...')
    // the av email lives on the user of the bearbeiter adresse
    const bearbeiterIds = [
      ...new Set((nodes ?? []).map((n) => n.bearbeiter).filter(Boolean)),
    ]
    const users =
      bearbeiterIds.length ?
        ((await apiFetch<{ adresse_id: string | null; email: string | null }[]>(
          `/user?adresse_id=in.(${bearbeiterIds.join(',')})&select=adresse_id,email`,
        )) ?? [])
      : []
    const emailByAdresse = new Map(
      users.map((u) => [u.adresse_id, u.email ?? null]),
    )
    const rows = (nodes ?? [])
      .map((n) => ({
        id: n.id,
        artname: n.ae_taxonomy_by_art_id?.artname ?? null,
        bearbeitung: n.ap_bearbstand_werte_by_bearbeitung?.text ?? null,
        startJahr: n.start_jahr,
        umsetzung: n.ap_umsetzung_werte_by_umsetzung?.text ?? null,
        avName: n.adresse_by_bearbeiter?.name ?? null,
        avEmail: emailByAdresse.get(n.bearbeiter) ?? null,
        createdAt: n.created_at,
        updatedAt: n.updated_at,
        changedBy: n.changed_by,
      }))
      // former orderBy AE_TAXONOMY_BY_ART_ID__ARTNAME_ASC
      .sort((a, b) => (a.artname ?? '').localeCompare(b.artname ?? ''))
    if (rows.length === 0) {
      setQueryState(undefined)
      return addNotification({
        message: 'Die Abfrage retournierte 0 Datensätze',
        options: {
          variant: 'warning',
        },
      })
    }
    void exportModule({
      data: rows,
      fileName: `Arten${filtered ? '_gefiltert' : ''}`,
    })
    setQueryState(undefined)
  }

  const apIsFiltered = tableIsFiltered({ table: 'ap' })

  return (
    <Button
      className={styles.button}
      onClick={() => void onClickAp()}
      color="inherit"
      disabled={!!queryState || (filtered && !apIsFiltered)}
    >
      {filtered ? 'Arten (gefiltert)' : 'Arten'}
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}

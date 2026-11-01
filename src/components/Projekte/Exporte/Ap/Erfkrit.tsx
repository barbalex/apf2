import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { sortBy } from 'es-toolkit'
import Button from '@mui/material/Button'

import { apiFetch } from '../../../../modules/api.ts'
import { exportModule } from '../../../../modules/export.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

export const Erfkrit = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickErfkrit = async () => {
    setQueryState('lade Daten...')
    let erfkrits:
      | {
          id: string
          ap_id: string | null
          erfolg: number | null
          kriterien: string | null
          created_at: string | null
          updated_at: string | null
          changed_by: string | null
        }[]
      | undefined
    let aps:
      | {
          id: string
          start_jahr: number | null
          ae_taxonomy_by_art_id: { artname: string | null } | null
          ap_bearbstand_werte_by_bearbeitung: { text: string | null } | null
          ap_umsetzung_werte_by_umsetzung: { text: string | null } | null
          adresse_by_bearbeiter: { name: string | null } | null
        }[]
      | undefined
    let werte = new Map<number, string>()
    try {
      const [erfkritsR, apsR, werteR] = await Promise.all([
        apiFetch<NonNullable<typeof erfkrits>>(
          `/q_erfkrit?select=id,ap_id,erfolg,kriterien,created_at,updated_at,changed_by`,
        ),
        apiFetch<NonNullable<typeof aps>>(
          `/v_ap?select=id,start_jahr,ae_taxonomy_by_art_id,ap_bearbstand_werte_by_bearbeitung,ap_umsetzung_werte_by_umsetzung,adresse_by_bearbeiter`,
        ),
        apiFetch<{ code: number; text: string | null }[]>(
          `/ap_erfkrit_werte?select=code,text`,
        ),
      ])
      erfkrits = erfkritsR ?? []
      aps = apsR ?? []
      werte = new Map((werteR ?? []).map((w) => [w.code, w.text ?? '']))
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    setQueryState('verarbeite...')
    const apById = new Map((aps ?? []).map((a) => [a.id, a]))
    const rows = (erfkrits ?? []).map((z) => {
      const ap = apById.get(z.ap_id ?? '')
      return {
        ap_id: z.ap_id,
        artname: ap?.ae_taxonomy_by_art_id?.artname ?? '',
        ap_bearbeitung: ap?.ap_bearbstand_werte_by_bearbeitung?.text ?? '',
        ap_start_jahr: ap?.start_jahr ?? '',
        ap_umsetzung: ap?.ap_umsetzung_werte_by_umsetzung?.text ?? '',
        ap_bearbeiter: ap?.adresse_by_bearbeiter?.name ?? '',
        id: z.id,
        beurteilung: z.erfolg === null ? '' : (werte.get(z.erfolg) ?? ''),
        kriterien: z.kriterien,
        created_at: z.created_at,
        updated_at: z.updated_at,
        changed_by: z.changed_by,
      }
    })
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
      data: sortBy(rows, ['artname', 'beurteilung']),
      fileName: 'Erfolgskriterien',
    })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      onClick={() => void onClickErfkrit()}
      color="inherit"
      disabled={!!queryState}
    >
      Erfolgskriterien
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}

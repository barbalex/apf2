import { useState } from 'react'
import { useSetAtom } from 'jotai'
import Button from '@mui/material/Button'

import { apiFetch } from '../../../../modules/api.ts'
import { exportModule } from '../../../../modules/export.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

export const BerUndMassn = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickApBerUndMassn = async () => {
    setQueryState('lade Daten...')
    let aps:
      | {
          id: string
          start_jahr: number | null
          created_at: string | null
          updated_at: string | null
          changed_by: string | null
          ae_taxonomy_by_art_id: {
            artname: string | null
            artwert: number | null
          } | null
          ap_bearbstand_werte_by_bearbeitung: { text: string | null } | null
          ap_umsetzung_werte_by_umsetzung: { text: string | null } | null
          adresse_by_bearbeiter: { name: string | null } | null
        }[]
      | undefined
    let massns:
      | {
          id: string
          massn_jahr: number | null
          massn_anzahl: number | null
          massn_anzahl_bisher: number | null
          bericht_erstellt: boolean | null
        }[]
      | undefined
    try {
      const [apsR, massnsR] = await Promise.all([
        apiFetch<NonNullable<typeof aps>>(
          `/v_ap?select=id,start_jahr,created_at,updated_at,changed_by,ae_taxonomy_by_art_id,ap_bearbstand_werte_by_bearbeitung,ap_umsetzung_werte_by_umsetzung,adresse_by_bearbeiter`,
        ),
        apiFetch<NonNullable<typeof massns>>(
          `/v_ap_apberundmassn?select=id,massn_jahr,massn_anzahl,massn_anzahl_bisher,bericht_erstellt`,
        ),
      ])
      aps = apsR ?? []
      massns = massnsR ?? []
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    setQueryState('verarbeite...')
    const massnByAp = new Map((massns ?? []).map((m) => [m.id, m]))
    const rows = (aps ?? [])
      .map((z) => {
        const m = massnByAp.get(z.id)
        return {
          ap_id: z.id,
          artname: z.ae_taxonomy_by_art_id?.artname ?? '',
          ap_bearbeitung: z.ap_bearbstand_werte_by_bearbeitung?.text ?? '',
          ap_start_jahr: z.start_jahr,
          ap_umsetzung: z.ap_umsetzung_werte_by_umsetzung?.text ?? '',
          ap_bearbeiter: z.adresse_by_bearbeiter?.name ?? '',
          artwert: z.ae_taxonomy_by_art_id?.artwert ?? '',
          massn_jahr: m?.massn_jahr ?? '',
          massn_anzahl: m?.massn_anzahl ?? '',
          massn_anzahl_bisher: m?.massn_anzahl_bisher ?? '',
          bericht_erstellt: m?.bericht_erstellt ?? '',
          created_at: z.created_at,
          updated_at: z.updated_at,
          changed_by: z.changed_by,
        }
      })
      // former orderBy AE_TAXONOMY_BY_ART_ID__ARTNAME_ASC
      .sort((a, b) => a.artname.localeCompare(b.artname))
    if (rows.length === 0) {
      setQueryState(undefined)
      return addNotification({
        message: 'Die Abfrage retournierte 0 Datensätze',
        options: {
          variant: 'warning',
        },
      })
    }
    void exportModule({ data: rows, fileName: 'ApJahresberichteUndMassnahmen' })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      onClick={() => void onClickApBerUndMassn()}
      color="inherit"
      disabled={!!queryState}
    >
      AP-Berichte und Massnahmen
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}

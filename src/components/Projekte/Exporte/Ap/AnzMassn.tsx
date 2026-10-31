import { useState } from 'react'
import { useSetAtom } from 'jotai'
import Button from '@mui/material/Button'

import { apiFetch } from '../../../../modules/api.ts'
import { exportModule } from '../../../../modules/export.ts'

import type { ApId } from '../../../../models/apflora/index.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

export const AnzMassn = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickAnzMassnProAp = async () => {
    setQueryState('lade Daten...')
    let aps:
      | {
          id: ApId
          start_jahr: number | null
          ae_taxonomy_by_art_id: { artname: string | null } | null
          ap_bearbstand_werte_by_bearbeitung: { text: string | null } | null
          ap_umsetzung_werte_by_umsetzung: { text: string | null } | null
        }[]
      | undefined
    let anzmassns: { id: string; anzahl_massnahmen: number | null }[] = []
    try {
      const [apsR, anzmassnsR] = await Promise.all([
        apiFetch<NonNullable<typeof aps>>(
          `/v_ap?select=id,start_jahr,ae_taxonomy_by_art_id,ap_bearbstand_werte_by_bearbeitung,ap_umsetzung_werte_by_umsetzung`,
        ),
        apiFetch<{ id: string; anzahl_massnahmen: number | null }[]>(
          `/v_ap_anzmassn?select=id,anzahl_massnahmen`,
        ),
      ])
      aps = apsR ?? []
      anzmassns = anzmassnsR ?? []
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    setQueryState('verarbeite...')
    const anzmassnById = new Map(anzmassns.map((a) => [a.id, a]))
    const rows = (aps ?? [])
      .map((z) => ({
        id: z.id,
        artname: z.ae_taxonomy_by_art_id?.artname ?? '',
        bearbeitung: z.ap_bearbstand_werte_by_bearbeitung?.text ?? '',
        start_jahr: z.start_jahr,
        umsetzung: z.ap_umsetzung_werte_by_umsetzung?.text ?? '',
        anzahl_massnahmen: anzmassnById.get(z.id)?.anzahl_massnahmen ?? '',
      }))
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
    void exportModule({ data: rows, fileName: 'ApAnzahlMassnahmen' })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      onClick={() => void onClickAnzMassnProAp()}
      color="inherit"
      disabled={!!queryState}
    >
      Anzahl Massnahmen pro Art
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}

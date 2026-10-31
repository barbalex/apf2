import { useState } from 'react'
import { useSetAtom } from 'jotai'
import Button from '@mui/material/Button'

import { apiFetch } from '../../../../modules/api.ts'
import { exportModule } from '../../../../modules/export.ts'


import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

export const ApOhnePop = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickApOhnePop = async () => {
    setQueryState('lade Daten...')
    let aps:
      | {
          id: string
          start_jahr: number | null
          ae_taxonomy_by_art_id: { artname: string | null } | null
          ap_bearbstand_werte_by_bearbeitung: { text: string | null } | null
          ap_umsetzung_werte_by_umsetzung: { text: string | null } | null
        }[]
      | undefined
    let popCounts: { ap_id: string; count: number }[] = []
    try {
      const [apsR, popsR] = await Promise.all([
        apiFetch<NonNullable<typeof aps>>(
          `/v_ap?select=id,start_jahr,ae_taxonomy_by_art_id,ap_bearbstand_werte_by_bearbeitung,ap_umsetzung_werte_by_umsetzung`,
        ),
        // pop count per ap, via Prefer: count=exact per ap is not
        // expressible in one GET — group client-side instead
        apiFetch<{ ap_id: string }[]>(`/q_pop?select=ap_id`),
      ])
      aps = apsR ?? []
      const counts = new Map<string, number>()
      for (const p of popsR ?? []) {
        counts.set(p.ap_id, (counts.get(p.ap_id) ?? 0) + 1)
      }
      popCounts = [...counts.entries()].map(([ap_id, count]) => ({
        ap_id,
        count,
      }))
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    setQueryState('verarbeite...')
    const popCountByAp = new Map(popCounts.map((p) => [p.ap_id, p.count]))
    const rows = (aps ?? [])
      .filter((z) => (popCountByAp.get(z.id) ?? 0) === 0)
      .map((z) => ({
        id: z.id,
        artname: z.ae_taxonomy_by_art_id?.artname ?? '',
        bearbeitung: z.ap_bearbstand_werte_by_bearbeitung?.text ?? '',
        start_jahr: z.start_jahr,
        umsetzung: z.ap_umsetzung_werte_by_umsetzung?.text ?? '',
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
    void exportModule({ data: rows, fileName: 'ApOhnePopulationen' })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      onClick={() => void onClickApOhnePop()}
      color="inherit"
      disabled={!!queryState}
    >
      Arten ohne Populationen
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}

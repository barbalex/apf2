import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { sortBy } from 'es-toolkit'
import Button from '@mui/material/Button'

import { apiFetch } from '../../../../modules/api.ts'
import { exportModule } from '../../../../modules/export.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

export const LetzteZaehlung = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickLetzteZaehlung = async () => {
    setQueryState('lade Daten...')
    let nodes: Record<string, unknown>[] = []
    try {
      nodes =
        (await apiFetch<Record<string, unknown>[]>(
          `/v_pop_last_count?select=*`,
        )) ?? []
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    setQueryState('verarbeite...')
    const rows = nodes.map((z) => ({
      artname: z['artname'] ?? '',
      ap_id: z['ap_id'] ?? '',
      pop_id: z['pop_id'] ?? '',
      pop_nr: z['pop_nr'] ?? '',
      pop_name: z['pop_name'] ?? '',
      pop_status: z['pop_status'] ?? '',
      jahre: z['jahre'] ?? '',
      pflanzenTotal: z['Pflanzen total'] ?? '',
      pflanzen_ohne_jungpflanzen: z['Pflanzen (ohne Jungpflanzen)'] ?? '',
      triebeTotal: z['Triebe total'] ?? '',
      triebe_beweidung: z['Triebe Beweidung'] ?? '',
      keimlinge: z['Keimlinge'] ?? '',
      davonRosetten: z['davon Rosetten'] ?? '',
      jungpflanzen: z['Jungpflanzen'] ?? '',
      blaetter: z['Blätter'] ?? '',
      davonBluehende_pflanzen: z['davon blühende Pflanzen'] ?? '',
      davonBluehende_triebe: z['davon blühende Triebe'] ?? '',
      blueten: z['Blüten'] ?? '',
      fertile_pflanzen: z['Fertile Pflanzen'] ?? '',
      fruchtende_triebe: z['fruchtende Triebe'] ?? '',
      bluetenstaende: z['Blütenstände'] ?? '',
      fruchtstaende: z['Fruchtstände'] ?? '',
      gruppen: z['Gruppen'] ?? '',
      deckung: z['Deckung (%)'] ?? '',
      pflanzen_5m2: z['Pflanzen/5m2'] ?? '',
      triebe_in_30m2: z['Triebe in 30 m2'] ?? '',
      triebe_50m2: z['Triebe/50m2'] ?? '',
      triebe_maehflaeche: z['Triebe Mähfläche'] ?? '',
      flaeche_m2: z['Fläche (m2)'] ?? '',
      pflanzstellen: z['Pflanzstellen'] ?? '',
      stellen: z['Stellen'] ?? '',
      andere_zaehleinheit: z['andere Zaehleinheit'] ?? '',
      art_ist_vorhanden: z['Art ist vorhanden'] ?? '',
    }))
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
      data: sortBy(rows, ['artname', 'pop_nr']),
      fileName: 'PopLetzteZaehlungen',
      idKey: 'pop_id',
    } as Parameters<typeof exportModule>[0])
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState}
      onClick={() => void onClickLetzteZaehlung()}
    >
      Letzte Zählungen
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}

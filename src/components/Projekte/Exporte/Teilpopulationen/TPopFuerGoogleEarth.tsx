import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { sortBy } from 'es-toolkit'
import Button from '@mui/material/Button'

import { apiFetch } from '../../../../modules/api.ts'
import { exportModule } from '../../../../modules/export.ts'


import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

export const TPopFuerGoogleEarth = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickTPopKml = async () => {
    setQueryState('lade Daten...')
    let nodes:
      | {
          art: string | null
          label: string | null
          inhalte: string | null
          id: string | null
          wgs84_lat: number | null
          wgs84_long: number | null
          url: string | null
        }[]
      | undefined
    try {
      nodes = (await apiFetch<NonNullable<typeof nodes>>(
        `/v_tpop_kml?select=art,label,inhalte,id,wgs84_lat,wgs84_long,url`,
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
    const rows = (nodes ?? []).map((z) => ({
      art: z.art ?? '',
      label: z.label ?? '',
      inhalte: z.inhalte ?? '',
      id: z.id ?? '',
      wgs84Lat: z.wgs84_lat ?? '',
      wgs84Long: z.wgs84_long ?? '',
      url: z.url ?? '',
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
      data: sortBy(rows, ['art', 'label']),
      fileName: 'Teilpopulationen',
      kml: true,
    })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState}
      onClick={() => void onClickTPopKml()}
    >
      {`Teilpopulationen für Google Earth (beschriftet mit PopNr/TPopNr)`}
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}

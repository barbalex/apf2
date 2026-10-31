import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { sortBy } from 'es-toolkit'
import Button from '@mui/material/Button'

import { apiFetch } from '../../../../modules/api.ts'
import { exportModule } from '../../../../modules/export.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

export const Ziele = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickZiele = async () => {
    setQueryState('lade Daten...')
    let ziels:
      | {
          id: string
          ap_id: string | null
          jahr: number | null
          typ: number | null
          bezeichnung: string | null
        }[]
      | undefined
    let aps:
      | {
          id: string
          art_id: string | null
          start_jahr: number | null
          ae_taxonomy_by_art_id: { artname: string | null } | null
          ap_bearbstand_werte_by_bearbeitung: { text: string | null } | null
          ap_umsetzung_werte_by_umsetzung: { text: string | null } | null
          adresse_by_bearbeiter: { name: string | null } | null
        }[]
      | undefined
    let typWerte = new Map<number, string>()
    try {
      const [zielsR, apsR, typWerteR] = await Promise.all([
        apiFetch<NonNullable<typeof ziels>>(
          `/q_ziel?select=id,ap_id,jahr,typ,bezeichnung`,
        ),
        apiFetch<NonNullable<typeof aps>>(
          `/v_ap?select=id,art_id,start_jahr,ae_taxonomy_by_art_id,ap_bearbstand_werte_by_bearbeitung,ap_umsetzung_werte_by_umsetzung,adresse_by_bearbeiter`,
        ),
        apiFetch<{ code: number; text: string | null }[]>(
          `/ziel_typ_werte?select=code,text`,
        ),
      ])
      ziels = zielsR ?? []
      aps = apsR ?? []
      typWerte = new Map((typWerteR ?? []).map((w) => [w.code, w.text ?? '']))
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
    const rows = (ziels ?? []).map((z) => {
      const ap = apById.get(z.ap_id ?? '')
      return {
        ap_id: z.id,
        artname: ap?.ae_taxonomy_by_art_id?.artname ?? '',
        ap_bearbeitung: ap?.ap_bearbstand_werte_by_bearbeitung?.text ?? '',
        ap_start_jahr: ap?.start_jahr ?? '',
        ap_umsetzung: ap?.ap_umsetzung_werte_by_umsetzung?.text ?? '',
        ap_bearbeiter: ap?.adresse_by_bearbeiter?.name ?? '',
        id: z.id,
        jahr: z.jahr,
        typ: z.typ === null ? '' : (typWerte.get(z.typ) ?? ''),
        bezeichnung: z.bezeichnung,
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
    void exportModule({ data: sortBy(rows, ['artname']), fileName: 'ApZiele' })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      onClick={() => void onClickZiele()}
      color="inherit"
      disabled={!!queryState}
    >
      Ziele
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}

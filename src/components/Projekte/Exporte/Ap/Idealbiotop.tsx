import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { sortBy } from 'es-toolkit'
import Button from '@mui/material/Button'

import { apiFetch } from '../../../../modules/api.ts'
import { exportModule } from '../../../../modules/export.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

export const Idealbiotop = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickIdealbiotop = async () => {
    setQueryState('lade Daten...')
    let biotopes:
      | {
          id: string
          ap_id: string | null
          erstelldatum: string | null
          hoehenlage: string | null
          region: string | null
          exposition: string | null
          besonnung: string | null
          hangneigung: string | null
          boden_typ: string | null
          boden_kalkgehalt: string | null
          boden_durchlaessigkeit: string | null
          boden_humus: string | null
          boden_naehrstoffgehalt: string | null
          wasserhaushalt: string | null
          konkurrenz: string | null
          moosschicht: string | null
          krautschicht: string | null
          strauchschicht: string | null
          baumschicht: string | null
          bemerkungen: string | null
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
    try {
      const [biotopesR, apsR] = await Promise.all([
        apiFetch<NonNullable<typeof biotopes>>(
          `/idealbiotop?select=id,ap_id,erstelldatum,hoehenlage,region,exposition,besonnung,hangneigung,boden_typ,boden_kalkgehalt,boden_durchlaessigkeit,boden_humus,boden_naehrstoffgehalt,wasserhaushalt,konkurrenz,moosschicht,krautschicht,strauchschicht,baumschicht,bemerkungen,created_at,updated_at,changed_by`,
        ),
        apiFetch<NonNullable<typeof aps>>(
          `/v_ap?select=id,start_jahr,ae_taxonomy_by_art_id,ap_bearbstand_werte_by_bearbeitung,ap_umsetzung_werte_by_umsetzung,adresse_by_bearbeiter`,
        ),
      ])
      biotopes = biotopesR ?? []
      aps = apsR ?? []
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
    const rows = (biotopes ?? []).map((z) => {
      const ap = apById.get(z.ap_id ?? '')
      return {
        ap_id: z.ap_id,
        artname: ap?.ae_taxonomy_by_art_id?.artname ?? '',
        ap_bearbeitung: ap?.ap_bearbstand_werte_by_bearbeitung?.text ?? '',
        ap_start_jahr: ap?.start_jahr ?? '',
        ap_umsetzung: ap?.ap_umsetzung_werte_by_umsetzung?.text ?? '',
        ap_bearbeiter: ap?.adresse_by_bearbeiter?.name ?? '',
        id: z.id,
        erstelldatum: z.erstelldatum,
        hoehenlage: z.hoehenlage,
        region: z.region,
        exposition: z.exposition,
        besonnung: z.besonnung,
        hangneigung: z.hangneigung,
        boden_typ: z.boden_typ,
        boden_kalkgehalt: z.boden_kalkgehalt,
        boden_durchlaessigkeit: z.boden_durchlaessigkeit,
        boden_humus: z.boden_humus,
        boden_naehrstoffgehalt: z.boden_naehrstoffgehalt,
        wasserhaushalt: z.wasserhaushalt,
        konkurrenz: z.konkurrenz,
        moosschicht: z.moosschicht,
        krautschicht: z.krautschicht,
        strauchschicht: z.strauchschicht,
        baumschicht: z.baumschicht,
        bemerkungen: z.bemerkungen,
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
      data: sortBy(rows, ['artname']),
      fileName: 'Idealbiotope',
    })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      onClick={() => void onClickIdealbiotop()}
      color="inherit"
      disabled={!!queryState}
    >
      Idealbiotope
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}

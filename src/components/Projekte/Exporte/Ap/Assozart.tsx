import { useState } from 'react'
import { useSetAtom } from 'jotai'
import Button from '@mui/material/Button'

import { apiFetch } from '../../../../modules/api.ts'
import { exportModule } from '../../../../modules/export.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

export const Assozart = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickAssozarten = async () => {
    setQueryState('lade Daten...')
    let assozarts:
      | {
          id: string
          ap_id: string | null
          ae_id: string | null
          bemerkungen: string | null
          created_at: string | null
          updated_at: string | null
          changed_by: string | null
        }[]
      | undefined
    let aps:
      | {
          id: string
          label: string | null
          start_jahr: number | null
          bearbeiter: string | null
          ap_bearbstand_werte_by_bearbeitung: { text: string | null } | null
          ap_umsetzung_werte_by_umsetzung: { text: string | null } | null
          adresse_by_bearbeiter: { name: string | null } | null
        }[]
      | undefined
    let artNamen = new Map<string, string>()
    try {
      const [assozartsR, apsR] = await Promise.all([
        apiFetch<NonNullable<typeof assozarts>>(
          `/q_assozart?select=id,ap_id,ae_id,bemerkungen,created_at,updated_at,changed_by`,
        ),
        apiFetch<NonNullable<typeof aps>>(
          `/v_ap?select=id,label,start_jahr,bearbeiter,ap_bearbstand_werte_by_bearbeitung,ap_umsetzung_werte_by_umsetzung,adresse_by_bearbeiter`,
        ),
      ])
      assozarts = assozartsR ?? []
      aps = apsR ?? []
      // the associated art's artname (former aeTaxonomyByAeId)
      const aeIds = [...new Set(assozarts.map((a) => a.ae_id).filter(Boolean))]
      if (aeIds.length) {
        const taxa =
          (await apiFetch<{ id: string; artname: string | null }[]>(
            `/ae_taxonomies?id=in.(${aeIds.join(',')})&select=id,artname`,
          )) ?? []
        artNamen = new Map(taxa.map((t) => [t.id, t.artname ?? '']))
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
    const apById = new Map((aps ?? []).map((a) => [a.id, a]))
    const rows = (assozarts ?? [])
      .map((z) => {
        const ap = apById.get(z.ap_id ?? '')
        return {
          ap_id: z.ap_id,
          artname: ap?.label ?? '',
          ap_bearbeitung: ap?.ap_bearbstand_werte_by_bearbeitung?.text ?? '',
          ap_start_jahr: ap?.start_jahr ?? '',
          ap_umsetzung: ap?.ap_umsetzung_werte_by_umsetzung?.text ?? '',
          ap_bearbeiter: ap?.adresse_by_bearbeiter?.name ?? '',
          id: z.id,
          artname_assoziiert: artNamen.get(z.ae_id ?? '') ?? '',
          bemerkungen: z.bemerkungen,
          created_at: z.created_at,
          updated_at: z.updated_at,
          changed_by: z.changed_by,
        }
      })
      // former orderBy [AP_BY_AP_ID__LABEL_ASC, AE_TAXONOMY_BY_AE_ID__ARTNAME_ASC]
      .sort(
        (a, b) =>
          a.artname.localeCompare(b.artname) ||
          a.artname_assoziiert.localeCompare(b.artname_assoziiert),
      )
    if (rows.length === 0) {
      setQueryState(undefined)
      return addNotification({
        message: 'Die Abfrage retournierte 0 Datensätze',
        options: {
          variant: 'warning',
        },
      })
    }
    void exportModule({ data: rows, fileName: 'AssoziierteArten' })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      onClick={() => void onClickAssozarten()}
      color="inherit"
      disabled={!!queryState}
    >
      Assoziierte Arten
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}

import { useState } from 'react'
import { useSetAtom } from 'jotai'
import Button from '@mui/material/Button'

import { apiFetch } from '../../../../modules/api.ts'
import { exportModule } from '../../../../modules/export.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

export const PriorisierungFuerEk = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickApPopEkPrio = async () => {
    setQueryState('lade Daten...')
    let aps:
      | {
          id: string
          start_jahr: number | null
          ae_taxonomy_by_art_id: {
            artname: string | null
            artwert: number | null
          } | null
          ap_bearbstand_werte_by_bearbeitung: { text: string | null } | null
          ap_umsetzung_werte_by_umsetzung: { text: string | null } | null
          adresse_by_bearbeiter: { name: string | null } | null
        }[]
      | undefined
    let prios:
      | {
          ap_id: string
          jahr_zuvor: number | null
          jahr_zuletzt: number | null
          anz_pop_urspr_zuvor: number | null
          anz_pop_anges_zuvor: number | null
          anz_pop_aktuell_zuvor: number | null
          anz_pop_urspr_zuletzt: number | null
          anz_pop_anges_zuletzt: number | null
          anz_pop_aktuell_zuletzt: number | null
          diff_pop_urspr: number | null
          diff_pop_anges: number | null
          diff_pop_aktuell: number | null
          beurteilung_zuletzt: number | null
        }[]
      | undefined
    try {
      const [apsR, priosR] = await Promise.all([
        // bearbeitung < 4: only real aps #@485
        apiFetch<NonNullable<typeof aps>>(
          `/v_ap?bearbeitung=lt.4&select=id,start_jahr,ae_taxonomy_by_art_id,ap_bearbstand_werte_by_bearbeitung,ap_umsetzung_werte_by_umsetzung,adresse_by_bearbeiter`,
        ),
        apiFetch<NonNullable<typeof prios>>(
          `/v_ap_pop_ek_prio?select=ap_id,jahr_zuvor,jahr_zuletzt,anz_pop_urspr_zuvor,anz_pop_anges_zuvor,anz_pop_aktuell_zuvor,anz_pop_urspr_zuletzt,anz_pop_anges_zuletzt,anz_pop_aktuell_zuletzt,diff_pop_urspr,diff_pop_anges,diff_pop_aktuell,beurteilung_zuletzt`,
        ),
      ])
      aps = apsR ?? []
      prios = priosR ?? []
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    setQueryState('verarbeite...')
    const prioByAp = new Map((prios ?? []).map((p) => [p.ap_id, p]))
    const rows = (aps ?? [])
      .map((z) => {
        const p = prioByAp.get(z.id)
        return {
          ap_id: z.id,
          artname: z.ae_taxonomy_by_art_id?.artname ?? '',
          ap_bearbeitung: z.ap_bearbstand_werte_by_bearbeitung?.text ?? '',
          ap_start_jahr: z.start_jahr,
          ap_umsetzung: z.ap_umsetzung_werte_by_umsetzung?.text ?? '',
          ap_bearbeiter: z.adresse_by_bearbeiter?.name ?? '',
          artwert: z.ae_taxonomy_by_art_id?.artwert ?? '',
          jahr_zuvor: p?.jahr_zuvor ?? '',
          jahr_zuletzt: p?.jahr_zuletzt ?? '',
          anz_pop_urspr_zuvor: p?.anz_pop_urspr_zuvor ?? '',
          anz_pop_anges_zuvor: p?.anz_pop_anges_zuvor ?? '',
          anz_pop_aktuell_zuvor: p?.anz_pop_aktuell_zuvor ?? '',
          anz_pop_ursp_zuletzt: p?.anz_pop_urspr_zuletzt ?? '',
          anz_pop_anges_zuletzt: p?.anz_pop_anges_zuletzt ?? '',
          anz_pop_aktuell_zuletzt: p?.anz_pop_aktuell_zuletzt ?? '',
          diff_pop_urspr: p?.diff_pop_urspr ?? '',
          diff_pop_anges: p?.diff_pop_anges ?? '',
          diff_pop_aktuell: p?.diff_pop_aktuell ?? '',
          beurteilung_zuletzt: p?.beurteilung_zuletzt ?? '',
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
    void exportModule({ data: rows, fileName: 'ApPriorisierungFuerEk' })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      onClick={() => void onClickApPopEkPrio()}
      color="inherit"
      disabled={!!queryState}
    >
      Priorisierung für EK basierend auf Pop-Entwicklung
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}

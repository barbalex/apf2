import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { sortBy } from 'es-toolkit'
import Button from '@mui/material/Button'

import { apiFetch } from '../../../../modules/api.ts'
import { exportModule } from '../../../../modules/export.ts'
import { veraenderungZumVorjahr } from '../../../../modules/veraenderungZumVorjahr.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

export const Ber = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickApBer = async () => {
    setQueryState('lade Daten...')
    let apbers:
      | {
          id: string
          ap_id: string | null
          jahr: number | null
          situation: string | null
          vergleich_vorjahr_gesamtziel: string | null
          beurteilung: number | null
          apber_analyse: string | null
          konsequenzen_umsetzung: string | null
          konsequenzen_erfolgskontrolle: string | null
          biotope_neue: string | null
          biotope_optimieren: string | null
          massnahmen_optimieren: string | null
          wirkung_auf_art: string | null
          created_at: string | null
          updated_at: string | null
          changed_by: string | null
          massnahmen_ap_bearb: string | null
          massnahmen_planung_vs_ausfuehrung: string | null
          datum: string | null
          bearbeiter: string | null
        }[]
      | undefined
    let artNamen = new Map<string, string>()
    let werte = new Map<number, { text: string | null; sort: number | null }>()
    let adressen = new Map<string, string>()
    try {
      const [apbersR, apsR, werteR, adressenR] = await Promise.all([
        apiFetch<NonNullable<typeof apbers>>(
          `/q_apber?select=id,ap_id,jahr,situation,vergleich_vorjahr_gesamtziel,beurteilung,apber_analyse,konsequenzen_umsetzung,konsequenzen_erfolgskontrolle,biotope_neue,biotope_optimieren,massnahmen_optimieren,wirkung_auf_art,created_at,updated_at,changed_by,massnahmen_ap_bearb,massnahmen_planung_vs_ausfuehrung,datum,bearbeiter`,
        ),
        apiFetch<
          {
            id: string
            ae_taxonomy_by_art_id: { artname: string | null } | null
          }[]
        >(`/v_ap?select=id,ae_taxonomy_by_art_id`),
        apiFetch<{ code: number; sort: number | null; text: string | null }[]>(
          `/ap_erfkrit_werte?select=code,sort,text`,
        ),
        apiFetch<{ id: string; name: string | null }[]>(
          `/v_adresse?select=id,name`,
        ),
      ])
      apbers = apbersR ?? []
      artNamen = new Map(
        (apsR ?? []).map((a) => [a.id, a.ae_taxonomy_by_art_id?.artname ?? '']),
      )
      werte = new Map(
        (werteR ?? []).map((w) => [w.code, { text: w.text, sort: w.sort }]),
      )
      adressen = new Map((adressenR ?? []).map((a) => [a.id, a.name ?? '']))
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    setQueryState('verarbeite...')
    // the export contains every apber, so the beurteilungen of the
    // previous years are already in this result and need no extra query
    const sortsByCode = new Map(
      [...werte.entries()].map(([code, w]) => [code, w.sort]),
    )
    const textByCode = new Map(
      [...werte.entries()].map(([code, w]) => [code, w.text ?? '']),
    )
    const beurteilungByApIdAndJahr = new Map(
      (apbers ?? [])
        .filter((z) => z.jahr != null)
        .map((z) => [`${z.ap_id}|${z.jahr}`, z.beurteilung] as const),
    )
    const rows = (apbers ?? []).map((z) => ({
      id: z.id,
      ap_id: z.ap_id,
      artname: artNamen.get(z.ap_id ?? '') ?? '',
      jahr: z.jahr,
      situation: z.situation,
      vergleich_vorjahr_gesamtziel: z.vergleich_vorjahr_gesamtziel,
      beurteilung: z.beurteilung,
      beurteilung_decodiert:
        z.beurteilung === null ? '' : (textByCode.get(z.beurteilung) ?? ''),
      veraenderung_zum_vorjahr: veraenderungZumVorjahr({
        beurteilung: z.beurteilung,
        beurteilungVorjahr:
          z.jahr == null ?
            null
          : (beurteilungByApIdAndJahr.get(`${z.ap_id}|${z.jahr - 1}`) ?? null),
        sortsByCode,
      }),
      apber_analyse: z.apber_analyse,
      konsequenzen_umsetzung: z.konsequenzen_umsetzung,
      konsequenzen_erfolgskontrolle: z.konsequenzen_erfolgskontrolle,
      biotope_neue: z.biotope_neue,
      biotope_optimieren: z.biotope_optimieren,
      massnahmen_optimieren: z.massnahmen_optimieren,
      wirkung_auf_art: z.wirkung_auf_art,
      created_at: z.created_at,
      updated_at: z.updated_at,
      changed_by: z.changed_by,
      massnahmen_ap_bearb: z.massnahmen_ap_bearb,
      massnahmen_planung_vs_ausfuehrung: z.massnahmen_planung_vs_ausfuehrung,
      datum: z.datum,
      bearbeiter: z.bearbeiter,
      bearbeiter_decodiert: adressen.get(z.bearbeiter ?? '') ?? '',
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
      data: sortBy(rows, ['artname', 'jahr']),
      fileName: 'Jahresberichte',
    })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      onClick={() => void onClickApBer()}
      color="inherit"
      disabled={!!queryState}
    >
      AP-Berichte (Jahresberichte)
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}

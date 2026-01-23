import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

interface InfoFloraQueryResult {
  allVExportInfoFloraBeobs: {
    nodes: Array<{
      idProjektintern?: string
      taxonomieId?: string
      taxonomie?: string
      artname?: string
      beobachtungstyp?: string
      beobachtungstypCodiert?: string
      herkunft?: string
      herkunftCodiert?: string
      status?: string
      bekanntSeit?: number
      datum?: string
      jahr?: number
      monat?: number
      tag?: number
      genauigkeitDatum?: string
      genauigkeitDatumCodiert?: string
      praesenz?: string
      praesenzCodiert?: string
      gefaehrdung?: string
      vitalitaet?: string
      beschreibung?: string
      lebensraumNachDelarze?: string
      umgebungNachDelarze?: string
      deckungMoosschicht?: number
      deckungKrautschicht?: number
      deckungStrauchschicht?: number
      deckungBaumschicht?: number
      genauigkeitLage?: string
      genauigkeitLageCodiert?: string
      geometryType?: string
      genauigkeitHoehe?: number
      x?: number
      y?: number
      gemeinde?: string
      flurname?: string
      obergrenzeHoehe?: number
      zaehlungen?: string
      expertiseIntroduit?: string
      expertiseIntroduiteNom?: string
      projekt?: string
      autor?: string
      aktionsplan?: string
    }>
  }
}

export const InfoFlora = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  const onClickInfoFlora = async () => {
    setQueryState('lade Daten...')
    let result: { data?: InfoFloraQueryResult }
    try {
      result = await apolloClient.query<InfoFloraQueryResult>({
        query: gql`
          query allVExportInfoFloraBeobs {
            allVExportInfoFloraBeobs {
              nodes {
                idProjektintern
                taxonomieId
                taxonomie
                artname
                beobachtungstyp
                beobachtungstypCodiert
                herkunft
                herkunftCodiert
                status
                bekanntSeit
                datum
                jahr
                monat
                tag
                genauigkeitDatum
                genauigkeitDatumCodiert
                praesenz
                praesenzCodiert
                gefaehrdung
                vitalitaet
                beschreibung
                lebensraumNachDelarze
                umgebungNachDelarze
                deckungMoosschicht
                deckungKrautschicht
                deckungStrauchschicht
                deckungBaumschicht
                genauigkeitLage
                genauigkeitLageCodiert
                geometryType
                genauigkeitHoehe
                x
                y
                gemeinde
                flurname
                obergrenzeHoehe
                zaehlungen
                expertiseIntroduit
                expertiseIntroduiteNom
                projekt
                autor
                aktionsplan
              }
            }
          }
        `,
      })
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    setQueryState('verarbeite...')
    const rows = (result.data?.allVExportInfoFloraBeobs?.nodes ?? []).map(
      (z) => ({
        id_projektintern: z.idProjektintern,
        taxonomie_id: z.taxonomieId,
        taxonomie: z.taxonomie,
        artname: z.artname,
        beobachtungstyp: z.beobachtungstyp,
        beobachtungstyp_codiert: z.beobachtungstypCodiert,
        herkunft: z.herkunft,
        herkunft_codiert: z.herkunftCodiert,
        status: z.status,
        bekannt_seit: z.bekanntSeit,
        datum: z.datum,
        jahr: z.jahr,
        monat: z.monat,
        tag: z.tag,
        genauigkeit_datum: z.genauigkeitDatum,
        genauigkeit_datum_codiert: z.genauigkeitDatumCodiert,
        praesenz: z.praesenz,
        praesenz_codiert: z.praesenzCodiert,
        gefaehrdung: z.gefaehrdung,
        vitalitaet: z.vitalitaet,
        beschreibung: z.beschreibung,
        lebensraum_nach_delarze: z.lebensraumNachDelarze,
        umgebung_nach_delarze: z.umgebungNachDelarze,
        deckung_moosschicht: z.deckungMoosschicht,
        deckung_krautschicht: z.deckungKrautschicht,
        deckung_strauchschicht: z.deckungStrauchschicht,
        deckung_baumschicht: z.deckungBaumschicht,
        genauigkeit_lage: z.genauigkeitLage,
        genauigkeit_lage_codiert: z.genauigkeitLageCodiert,
        geometry_type: z.geometryType,
        genauigkeit_hoehe: z.genauigkeitHoehe,
        x: z.x,
        y: z.y,
        gemeinde: z.gemeinde,
        flurname: z.flurname,
        obergrenze_hoehe: z.obergrenzeHoehe,
        zaehlungen: z.zaehlungen,
        expertise_introduit: z.expertiseIntroduit,
        expertise_introduite_nom: z.expertiseIntroduiteNom,
        projekt: z.projekt,
        autor: z.autor,
        aktionsplan: z.aktionsplan,
      }),
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
    exportModule({ data: rows, fileName: 'KontrollenApFloraZhFuerInfoFlora' })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      onClick={onClickInfoFlora}
      color="inherit"
      disabled={!!queryState}
    >
      Kontrollen als Beobachtungen für Info Flora
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}

import { memo, useContext, useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import { exportModule } from '../../../../modules/export.js'
import { MobxContext } from '../../../../mobxContext.js'
import { DownloadCardButton, StyledProgressText } from '../index.jsx'

export const InfoFlora = memo(
  observer(() => {
    const client = useApolloClient()
    const store = useContext(MobxContext)
    const { enqueNotification } = store

    const [queryState, setQueryState] = useState()

    const onClickInfoFlora = useCallback(async () => {
      setQueryState('lade Daten...')
      let result
      try {
        result = await client.query({
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
                  x
                  y
                  gemeinde
                  flurname
                  obergrenzeHoehe
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
        enqueNotification({
          message: error.message,
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
          x: z.x,
          y: z.y,
          gemeinde: z.gemeinde,
          flurname: z.flurname,
          obergrenze_hoehe: z.obergrenzeHoehe,
          expertise_introduit: z.expertiseIntroduit,
          expertise_introduite_nom: z.expertiseIntroduiteNom,
          projekt: z.projekt,
          autor: z.autor,
          aktionsplan: z.aktionsplan,
        }),
      )
      if (rows.length === 0) {
        setQueryState(undefined)
        return enqueNotification({
          message: 'Die Abfrage retournierte 0 Datensätze',
          options: {
            variant: 'warning',
          },
        })
      }
      exportModule({
        data: rows,
        fileName: 'KontrollenApFloraZhFuerInfoFlora',
        store,
      })
      setQueryState(undefined)
    }, [enqueNotification, client, store])

    return (
      <DownloadCardButton
        onClick={onClickInfoFlora}
        color="inherit"
        disabled={!!queryState}
      >
        Kontrollen als Beobachtungen für Info Flora
        {queryState ?
          <StyledProgressText>{queryState}</StyledProgressText>
        : null}
      </DownloadCardButton>
    )
  }),
)

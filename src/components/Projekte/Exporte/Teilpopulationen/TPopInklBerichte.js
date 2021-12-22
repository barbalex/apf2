import React, { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const TPopInklBerichte = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { enqueNotification } = store

  const [queryState, setQueryState] = useState()

  return (
    <DownloadCardButton
      color="inherit"
      disabled={!!queryState}
      onClick={async () => {
        setQueryState('lade Daten...')
        let result
        try {
          result = await client.query({
            query: gql`
              query viewTpopPopberundmassnbers {
                allVTpopPopberundmassnbers {
                  nodes {
                    ap_id: apId
                    artname
                    ap_bearbeitung: apBearbeitung
                    ap_start_jahr: apStartJahr
                    ap_umsetzung: apUmsetzung
                    pop_id: popId
                    pop_nr: popNr
                    pop_name: popName
                    pop_status: popStatus
                    pop_bekannt_seit: popBekanntSeit
                    pop_status_unklar: popStatusUnklar
                    pop_status_unklar_begruendung: popStatusUnklarBegruendung
                    pop_x: popX
                    pop_y: popY
                    tpop_id: tpopId
                    tpop_nr: tpopNr
                    tpop_gemeinde: tpopGemeinde
                    tpop_flurname: tpopFlurname
                    tpop_status: tpopStatus
                    tpop_bekannt_seit: tpopBekanntSeit
                    tpop_status_unklar: tpopStatusUnklar
                    tpop_status_unklar_grund: tpopStatusUnklarGrund
                    tpop_x: tpopX
                    tpop_y: tpopY
                    tpop_radius: tpopRadius
                    tpop_hoehe: tpopHoehe
                    tpop_exposition: tpopExposition
                    tpop_klima: tpopKlima
                    tpop_neigung: tpopNeigung
                    tpop_beschreibung: tpopBeschreibung
                    tpop_kataster_nr: tpopKatasterNr
                    tpop_apber_relevant: tpopApberRelevant
                    tpop_eigentuemer: tpopEigentuemer
                    tpop_kontakt: tpopKontakt
                    tpop_nutzungszone: tpopNutzungszone
                    tpop_bewirtschafter: tpopBewirtschafter
                    tpop_bewirtschaftung: tpopBewirtschaftung
                    tpop_ekfrequenz: tpopEkfrequenz
                    tpop_ekfrequenz_abweichend: tpopEkfrequenzAbweichend
                    tpopber_id: tpopberId
                    tpopber_jahr: tpopberJahr
                    tpopber_entwicklung: tpopberEntwicklung
                    tpopber_bemerkungen: tpopberBemerkungen
                    tpopber_created_at: tpopberCreatedAt
                    tpopber_updated_at: tpopberUpdatedAt
                    tpopber_changed_by: tpopberChangedBy
                    tpopmassnber_id: tpopmassnberId
                    tpopmassnber_jahr: tpopmassnberJahr
                    tpopmassnber_entwicklung: tpopmassnberEntwicklung
                    tpopmassnber_bemerkungen: tpopmassnberBemerkungen
                    tpopmassnber_created_at: tpopmassnberCreatedAt
                    tpopmassnber_updated_at: tpopmassnberUpdatedAt
                    tpopmassnber_changed_by: tpopmassnberChangedBy
                  }
                }
              }
            `,
          })
        } catch (error) {
          enqueNotification({
            message: error.message,
            options: { variant: 'error' },
          })
        }
        setQueryState('verarbeite...')
        const rows = result.data?.allVTpopPopberundmassnbers?.nodes ?? []
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
          fileName: 'TeilpopulationenTPopUndMassnBerichte',
          idKey: 'tpop_id',
          xKey: 'tpop_wgs84lat',
          yKey: 'tpop_wgs84long',
          store,
        })
        setQueryState(undefined)
      }}
    >
      Teilpopulationen inklusive Teilpopulations- und Massnahmen-Berichten
      {queryState ? (
        <StyledProgressText>{queryState}</StyledProgressText>
      ) : null}
    </DownloadCardButton>
  )
}

export default observer(TPopInklBerichte)

import React, { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const Massnahmen = ({ filtered = false }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { enqueNotification, tableIsFiltered } = store
  const { tpopmassnGqlFilter } = store.tree

  const [queryState, setQueryState] = useState()

  const tpopmassnIsFiltered = tableIsFiltered('tpopmassn')

  return (
    <DownloadCardButton
      color="inherit"
      disabled={!!queryState || (filtered && !tpopmassnIsFiltered)}
      onClick={async () => {
        setQueryState('lade Daten...')
        let result
        try {
          result = await client.query({
            query: gql`
              query tpopmassnForExportQuery($filter: TpopmassnFilter) {
                allTpopmassns(
                  filter: $filter
                  orderBy: [
                    AP_NAME_ASC
                    POP_NR_ASC
                    TPOP_BY_TPOP_ID__NR_ASC
                    DATUM_ASC
                  ]
                ) {
                  nodes {
                    tpopByTpopId {
                      popByPopId {
                        apByApId {
                          id
                          aeTaxonomyByArtId {
                            id
                            artname
                            familie
                          }
                          apBearbstandWerteByBearbeitung {
                            id
                            text
                          }
                          startJahr
                          apUmsetzungWerteByUmsetzung {
                            id
                            text
                          }
                        }
                        id
                        nr
                        name
                        popStatusWerteByStatus {
                          id
                          text
                        }
                        bekanntSeit
                        statusUnklar
                        statusUnklarBegruendung
                        x: lv95X
                        y: lv95Y
                      }
                      id
                      nr
                      gemeinde
                      flurname
                      status
                      popStatusWerteByStatus {
                        id
                        text
                      }
                      bekanntSeit
                      statusUnklar
                      statusUnklarGrund
                      x: lv95X
                      y: lv95Y
                      radius
                      hoehe
                      exposition
                      klima
                      neigung
                      beschreibung
                      katasterNr
                      apberRelevant
                      apberRelevantGrund
                      eigentuemer
                      kontakt
                      nutzungszone
                      bewirtschafter
                      bewirtschaftung
                      ekfrequenz
                      ekfrequenzAbweichend
                      adresseByEkfKontrolleur {
                        id
                        name
                      }
                    }
                    id
                    jahr
                    datum
                    tpopmassnTypWerteByTyp {
                      id
                      text
                    }
                    beschreibung
                    adresseByBearbeiter {
                      id
                      name
                    }
                    bemerkungen
                    planVorhanden
                    planBezeichnung
                    flaeche
                    form
                    pflanzanordnung
                    markierung
                    anzTriebe
                    anzPflanzen
                    anzPflanzstellen
                    tpopkontrzaehlEinheitWerteByZieleinheitEinheit {
                      id
                      text
                    }
                    zieleinheitAnzahl
                    wirtspflanze
                    herkunftPop
                    sammeldatum
                    vonAnzahlIndividuen
                    createdAt
                    updatedAt
                    changedBy
                  }
                }
              }
            `,
            variables: {
              filter: filtered ? tpopmassnGqlFilter.filtered : { or: [] },
            },
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
        const rows = (result?.data?.allTpopmassns.nodes ?? []).map((n) => ({
          apId: n?.tpopByTpopId?.popByPopId?.apByApId?.id ?? null,
          apFamilie:
            n?.tpopByTpopId?.popByPopId?.apByApId?.aeTaxonomyByArtId?.familie ??
            null,
          apArtname:
            n?.tpopByTpopId?.popByPopId?.apByApId?.aeTaxonomyByArtId?.artname ??
            null,
          apBearbeitung:
            n?.tpopByTpopId?.popByPopId?.apByApId
              ?.apBearbstandWerteByBearbeitung?.text ?? null,
          apStartJahr: n?.tpopByTpopId?.popByPopId?.apByApId?.startJahr ?? null,
          apUmsetzung:
            n?.tpopByTpopId?.popByPopId?.apByApId?.apUmsetzungWerteByUmsetzung
              ?.text ?? null,
          popId: n?.tpopByTpopId?.popByPopId?.id ?? null,
          popNr: n?.tpopByTpopId?.popByPopId?.nr ?? null,
          popName: n?.tpopByTpopId?.popByPopId?.name ?? null,
          popStatus:
            n?.tpopByTpopId?.popByPopId?.popStatusWerteByStatus?.text ?? null,
          popBekanntSeit: n?.tpopByTpopId?.popByPopId?.bekanntSeit ?? null,
          popStatusUnklar: n?.tpopByTpopId?.popByPopId?.statusUnklar ?? null,
          popStatusUnklarBegruendung:
            n?.tpopByTpopId?.popByPopId?.statusUnklarBegruendung ?? null,
          popX: n?.tpopByTpopId?.popByPopId?.x ?? null,
          popY: n?.tpopByTpopId?.popByPopId?.y ?? null,
          tpopId: n?.tpopByTpopId?.id ?? null,
          tpopNr: n?.tpopByTpopId?.nr ?? null,
          tpopGemeinde: n?.tpopByTpopId?.gemeinde ?? null,
          tpopFlurname: n?.tpopByTpopId?.flurname ?? null,
          tpopStatus: n?.tpopByTpopId?.status ?? null,
          statusDecodiert:
            n?.tpopByTpopId?.popStatusWerteByStatus?.text ?? null,
          tpopBekanntSeit: n?.tpopByTpopId?.bekanntSeit ?? null,
          tpopStatusUnklar: n?.tpopByTpopId?.statusUnklar ?? null,
          tpopStatusUnklarGrund: n?.tpopByTpopId?.statusUnklarGrund ?? null,
          tpopX: n?.tpopByTpopId?.x ?? null,
          tpopY: n?.tpopByTpopId?.y ?? null,
          tpopRadius: n?.tpopByTpopId?.radius ?? null,
          tpopHoehe: n?.tpopByTpopId?.hoehe ?? null,
          tpopExposition: n?.tpopByTpopId?.exposition ?? null,
          tpopKlima: n?.tpopByTpopId?.klima ?? null,
          tpopNeigung: n?.tpopByTpopId?.neigung ?? null,
          tpopBeschreibung: n?.tpopByTpopId?.beschreibung ?? null,
          tpopKatasterNr: n?.tpopByTpopId?.katasterNr ?? null,
          tpopApberRelevant: n?.tpopByTpopId?.apberRelevant ?? null,
          tpopApberRelevantGrund: n?.tpopByTpopId?.apberRelevantGrund ?? null,
          tpopEigentuemer: n?.tpopByTpopId?.eigentuemer ?? null,
          tpopKontakt: n?.tpopByTpopId?.kontakt ?? null,
          tpopNutzungszone: n?.tpopByTpopId?.nutzungszone ?? null,
          tpopBewirtschafter: n?.tpopByTpopId?.bewirtschafter ?? null,
          tpopBewirtschaftung: n?.tpopByTpopId?.bewirtschaftung ?? null,
          tpopEkfrequenz: n?.tpopByTpopId?.ekfrequenz ?? null,
          tpopEkfrequenzAbweichend:
            n?.tpopByTpopId?.ekfrequenzAbweichend ?? null,
          tpopEkfKontrolleur:
            n?.tpopByTpopId?.adresseByEkfKontrolleur?.name ?? null,
          id: n.id,
          jahr: n.jahr,
          datum: n.datum,
          typ: n?.tpopmassnTypWerteByTyp?.text ?? null,
          beschreibung: n.beschreibung,
          bearbeiter: n?.adresseByBearbeiter?.name ?? null,
          bemerkungen: n.bemerkungen,
          planVorhanden: n.planVorhanden,
          planBezeichnung: n.planBezeichnung,
          flaeche: n.flaeche,
          form: n.form,
          pflanzanordnung: n.pflanzanordnung,
          markierung: n.markierung,
          anzTriebe: n.anzTriebe,
          anzPflanzen: n.anzPflanzen,
          anzPflanzstellen: n.anzPflanzstellen,
          zieleinheitEinheit:
            n?.tpopkontrzaehlEinheitWerteByZieleinheitEinheit?.text ?? null,
          zieleinheitAnzahl: n.zieleinheitAnzahl,
          wirtspflanze: n.wirtspflanze,
          herkunftPop: n.herkunftPop,
          sammeldatum: n.sammeldatum,
          vonAnzahlIndividuen: n.vonAnzahlIndividuen,
          createdAt: n.createdAt,
          updatedAt: n.updatedAt,
          changedBy: n.changedBy,
        }))
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
          fileName: 'Massnahmen',
          store,
        })
        setQueryState(undefined)
      }}
    >
      {filtered ? 'Massnahmen (gefiltert)' : 'Massnahmen'}
      {queryState ? (
        <StyledProgressText>{queryState}</StyledProgressText>
      ) : null}
    </DownloadCardButton>
  )
}

export default observer(Massnahmen)

import React, { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const KontrollenButton = ({ treeName, filtered = false }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { enqueNotification } = store
  const { tpopkontrGqlFilter } = store[treeName]

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
              query tpopkontrForExportQuery($filter: TpopkontrFilter) {
                allTpopkontrs(
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
                      kataster_nr: katasterNr
                      apber_relevant: apberRelevant
                      apber_relevant_grund: apberRelevantGrund
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
                    tpopkontrTypWerteByTyp {
                      id
                      text
                    }
                    adresseByBearbeiter {
                      id
                      name
                    }
                    ueberlebensrate
                    vitalitaet
                    tpopEntwicklungWerteByEntwicklung {
                      id
                      text
                    }
                    ursachen
                    erfolgsbeurteilung
                    umsetzungAendern
                    kontrolleAendern
                    bemerkungen
                    lrDelarze
                    lrUmgebungDelarze
                    vegetationstyp
                    konkurrenz
                    moosschicht
                    krautschicht
                    strauchschicht
                    baumschicht
                    tpopkontrIdbiotuebereinstWerteByIdealbiotopUebereinstimmung {
                      id
                      text
                    }
                    handlungsbedarf
                    flaecheUeberprueft
                    flaeche
                    planVorhanden
                    deckungVegetation
                    deckungNackterBoden
                    deckungApArt
                    jungpflanzenVorhanden
                    vegetationshoeheMaximum
                    vegetationshoeheMittel
                    gefaehrdung
                    createdAt
                    updatedAt
                    changedBy
                    apberNichtRelevant
                    apberNichtRelevantGrund
                    ekfBemerkungen
                    tpopkontrzaehlsByTpopkontrId {
                      nodes {
                        id
                        anzahl
                        tpopkontrzaehlEinheitWerteByEinheit {
                          id
                          text
                        }
                        tpopkontrzaehlMethodeWerteByMethode {
                          id
                          text
                        }
                      }
                    }
                  }
                }
              }
            `,
            variables: {
              filter: filtered ? tpopkontrGqlFilter : { or: [] },
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
        const rows = (result.data?.allTpopkontrs?.nodes ?? []).map((n) => ({
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
          tpopBekanntSeit: n?.optimizetpopByTpopId?.bekanntSeit ?? null,
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
          typ: n?.tpopkontrTypWerteByTyp?.text ?? null,
          bearbeiter: n?.adresseByBearbeiter?.name ?? null,
          ueberlebensrate: n.ueberlebensrate,
          vitalitaet: n.vitalitaet,
          entwicklung: n?.tpopEntwicklungWerteByEntwicklung?.text ?? null,
          ursachen: n.ursachen,
          erfolgsbeurteilung: n.erfolgsbeurteilung,
          umsetzungAendern: n.umsetzungAendern,
          kontrolleAendern: n.kontrolleAendern,
          bemerkungen: n.bemerkungen,
          lrDelarze: n.lrDelarze,
          lrUmgebungDelarze: n.lrUmgebungDelarze,
          vegetationstyp: n.vegetationstyp,
          konkurrenz: n.konkurrenz,
          moosschicht: n.moosschicht,
          krautschicht: n.krautschicht,
          strauchschicht: n.strauchschicht,
          baumschicht: n.baumschicht,
          idealbiotopUebereinstimmung:
            n?.tpopkontrIdbiotuebereinstWerteByIdealbiotopUebereinstimmung
              ?.text ?? null,
          handlungsbedarf: n.handlungsbedarf,
          flaecheUeberprueft: n.flaecheUeberprueft,
          flaeche: n.flaeche,
          planVorhanden: n.planVorhanden,
          deckungVegetation: n.deckungVegetation,
          deckungNackterBoden: n.deckungNackterBoden,
          deckungApArt: n.deckungApArt,
          jungpflanzenVorhanden: n.jungpflanzenVorhanden,
          vegetationshoeheMaximum: n.vegetationshoeheMaximum,
          vegetationshoeheMittel: n.vegetationshoeheMittel,
          gefaehrdung: n.gefaehrdung,
          createdAt: n.createdAt,
          updatedAt: n.updatedAt,
          changedBy: n.changedBy,
          apberNichtRelevant: n.apberNichtRelevant,
          apberNichtRelevantGrund: n.apberNichtRelevantGrund,
          ekfBemerkungen: n.ekfBemerkungen,
          zaehlungen: (n?.tpopkontrzaehlsByTpopkontrId?.nodes ?? [])
            .map(
              (n) =>
                `Einheit: ${
                  n?.tpopkontrzaehlEinheitWerteByEinheit?.text ?? '(keine)'
                }, Methode: ${
                  n?.tpopkontrzaehlMethodeWerteByMethode?.text ?? '(keine)'
                }, Anzahl: ${n.anzahl ?? '(keine)'}`,
            )
            .join(' / '),
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
          fileName: 'Kontrollen',
          idKey: 'tpop_id',
          xKey: 'tpop_wgs84lat',
          yKey: 'tpop_wgs84long',
          store,
        })
        setQueryState(undefined)
      }}
    >
      {filtered ? 'Kontrollen (gefiltert)' : 'Kontrollen'}
      {queryState ? (
        <StyledProgressText>{queryState}</StyledProgressText>
      ) : null}
    </DownloadCardButton>
  )
}

export default observer(KontrollenButton)

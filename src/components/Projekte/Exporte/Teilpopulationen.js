// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Collapse from 'material-ui/transitions/Collapse'
import IconButton from 'material-ui/IconButton'
import Icon from 'material-ui/Icon'
import Button from 'material-ui/Button'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withProps from 'recompose/withProps'
import styled from 'styled-components'
import sortBy from 'lodash/sortBy'
import { ApolloConsumer } from 'react-apollo'
import gql from "graphql-tag"
import get from 'lodash/get'

import AutoComplete from './Autocomplete'
import exportModule from '../../../modules/export'
import Message from './Message'

const StyledCard = styled(Card)`
  margin: 10px 0;
  background-color: #fff8e1 !important;
`
const StyledCardActions = styled(CardActions)`
  justify-content: space-between;
  cursor: pointer;
  height: auto !important;
`
const CardActionIconButton = styled(IconButton)`
  transform: ${props => (props['data-expanded'] ? 'rotate(180deg)' : 'none')};
`
const CardActionTitle = styled.div`
  padding-left: 8px;
  font-weight: bold;
  word-break: break-word;
  user-select: none;
`
const StyledCardContent = styled(CardContent)`
  margin: -15px 0 0 0;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: stretch;
  align-content: stretch;
`
const DownloadCardButton = styled(Button)`
  flex-basis: 450px;
  > span:first-of-type {
    text-transform: none !important;
    font-weight: 500;
    display: block;
    text-align: left;
    justify-content: flex-start !important;
    user-select: none;
  }
`
const AutocompleteContainer = styled.div`
  flex-basis: 450px;
  padding-left: 16px;
`
const isRemoteHost = window.location.hostname !== 'localhost'

const enhance = compose(
  inject('store'),
  withState('expanded', 'setExpanded', false),
  withState('message', 'setMessage', null),
  observer,
  withProps(props => {
    const { store } = props
    const { ae_eigenschaften } = store.table
    const aps = Array.from(store.table.ap.values()).filter(ap => !!ap.art_id)
    const aes = Array.from(ae_eigenschaften.values())
    let artList = aps.map(ap => {
      const ae = aes.find(a => a.id === ap.art_id)
      return {
        id: ap.id,
        value: ae && ae.artname ? ae.artname : '',
      }
    })
    artList = sortBy(artList, 'value')
    return { artList }
  })
)

const Teilpopulationen = ({
  store,
  expanded,
  setExpanded,
  message,
  setMessage,
  artList,
}: {
  store:Object,
  expanded: Boolean,
  setExpanded: () => void,
  message: String,
  setMessage: () => void,
  artList: Array<Object>,
}) => (
  <ApolloConsumer>
    {client =>
      <StyledCard>
        <StyledCardActions
          disableActionSpacing
          onClick={() => setExpanded(!expanded)}
        >
          <CardActionTitle>Teilpopulationen</CardActionTitle>
          <CardActionIconButton
            data-expanded={expanded}
            aria-expanded={expanded}
            aria-label="öffnen"
          >
            <Icon title={expanded ? 'schliessen' : 'öffnen'}>
              <ExpandMoreIcon />
            </Icon>
          </CardActionIconButton>
        </StyledCardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <StyledCardContent>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "Teilpopulationen" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVTpops {
                          nodes {
                            apId
                            familie
                            artname
                            apBearbeitung
                            apStartJahr
                            apUmsetzung
                            popId
                            popNr
                            popName
                            popStatus
                            popBekanntSeit
                            popStatusUnklar
                            popStatusUnklarBegruendung
                            popX
                            popY
                            id
                            nr
                            gemeinde
                            flurname
                            status
                            bekanntSeit
                            statusUnklar
                            statusUnklarGrund
                            x
                            y
                            radius
                            hoehe
                            exposition
                            klima
                            neigung
                            beschreibung
                            katasterNr
                            apberRelevant
                            eigentuemer
                            kontakt
                            nutzungszone
                            bewirtschafter
                            bewirtschaftung
                            changed
                            changedBy
                          }
                        }
                      }`
                  })
                  exportModule({data: get(data, 'allVTpops.nodes', []), store, fileName: 'Teilpopulationen'})
                } catch(error) {
                  setMessage(`Fehler: ${error.message}`)
                  setTimeout(() => setMessage(null), 5000)
                }
                setMessage(null)
              }}
            >
              Teilpopulationen
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "TeilpopulationenWebGisBun" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVTpopWebgisbuns {
                          nodes {
                            APARTID: apartid
                            APART: apart
                            APSTATUS: apstatus
                            APSTARTJAHR: apstartjahr
                            APSTANDUMSETZUNG: apstandumsetzung
                            POPGUID: popguid
                            POPNR: popnr
                            POPNAME: popname
                            POPSTATUS: popstatus
                            POPSTATUSUNKLAR: popstatusunklar
                            POPUNKLARGRUND: popunklargrund
                            POPBEKANNTSEIT: popbekanntseit
                            POP_X: popX
                            POP_Y: popY
                            TPOPID: tpopid
                            TPOPGUID: tpopguid
                            TPOPNR: tpopnr
                            TPOPGEMEINDE: tpopgemeinde
                            TPOPFLURNAME: tpopflurname
                            TPOPSTATUS: tpopstatus
                            TPOPSTATUSUNKLAR: tpopstatusunklar
                            TPOPUNKLARGRUND: tpopunklargrund
                            TPOP_X: tpopX
                            TPOP_Y: tpopY
                            TPOPRADIUS: tpopradius
                            TPOPHOEHE: tpophoehe
                            TPOPEXPOSITION: tpopexposition
                            TPOPKLIMA: tpopklima
                            TPOPHANGNEIGUNG: tpophangneigung
                            TPOPBESCHREIBUNG: tpopbeschreibung
                            TPOPKATASTERNR: tpopkatasternr
                            TPOPVERANTWORTLICH: tpopverantwortlich
                            TPOPBERICHTSRELEVANZ: tpopberichtsrelevanz
                            TPOPBEKANNTSEIT: tpopbekanntseit
                            TPOPEIGENTUEMERIN: tpopeigentuemerin
                            TPOPKONTAKTVO: tpopkontaktVo
                            TPOPNUTZUNGSZONE: tpopNutzungszone
                            TPOPBEWIRTSCHAFTER: tpopbewirtschafter
                            TPOPBEWIRTSCHAFTUNG: tpopbewirtschaftung
                            TPOPCHANGEDAT: tpopchangedat
                            TPOPCHANGEBY: tpopchangeby
                          }
                        }
                      }`
                  })
                  exportModule({data: get(data, 'allVTpopWebgisbuns.nodes', []), store, fileName: 'TeilpopulationenWebGisBun'})
                } catch(error) {
                  setMessage(`Fehler: ${error.message}`)
                  setTimeout(() => setMessage(null), 5000)
                }
                setMessage(null)
              }}
            >
              Teilpopulationen für WebGIS BUN
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "Teilpopulationen" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVTpopKmls {
                          nodes {
                            art
                            label
                            inhalte
                            laengengrad
                            breitengrad
                            url
                          }
                        }
                      }`
                  })
                  exportModule({data: get(data, 'allVTpopKmls.nodes', []), store, fileName: 'Teilpopulationen'})
                } catch(error) {
                  setMessage(`Fehler: ${error.message}`)
                  setTimeout(() => setMessage(null), 5000)
                }
                setMessage(null)
              }}
            >
              <div>Teilpopulationen für Google Earth</div>
              <div>(beschriftet mit PopNr/TPopNr)</div>
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "TeilpopulationenNachNamen" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVTpopKmlnamen {
                          nodes {
                            art
                            label
                            inhalte
                            laengengrad
                            breitengrad
                            url
                          }
                        }
                      }`
                  })
                  exportModule({data: get(data, 'allVTpopKmlnamen.nodes', []), store, fileName: 'TeilpopulationenNachNamen'})
                } catch(error) {
                  setMessage(`Fehler: ${error.message}`)
                  setTimeout(() => setMessage(null), 5000)
                }
                setMessage(null)
              }}
            >
              <div>Teilpopulationen für Google Earth</div>
              <div>(beschriftet mit Artname, PopNr/TPopNr)</div>
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "TeilpopulationenVonApArtenOhneBekanntSeit" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVTpopOhnebekanntseits {
                          nodes {
                            artname
                            apBearbeitung
                            popNr
                            popName
                            nr
                            gemeinde
                            flurname
                            bekanntSeit
                          }
                        }
                      }`
                  })
                  exportModule({data: get(data, 'allVTpopOhnebekanntseits.nodes', []), store, fileName: 'TeilpopulationenVonApArtenOhneBekanntSeit'})
                } catch(error) {
                  setMessage(`Fehler: ${error.message}`)
                  setTimeout(() => setMessage(null), 5000)
                }
                setMessage(null)
              }}
            >
              <div>Teilpopulationen von AP-Arten</div>
              <div>{'ohne "Bekannt seit"'}</div>
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "TeilpopulationenOhneApBerichtRelevant" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVTpopOhneapberichtrelevants {
                          nodes {
                            artname
                            popNr
                            popName
                            id
                            nr
                            gemeinde
                            flurname
                            apberRelevant
                          }
                        }
                      }`
                  })
                  exportModule({data: get(data, 'allVTpopOhneapberichtrelevants.nodes', []), store, fileName: 'TeilpopulationenOhneApBerichtRelevant'})
                } catch(error) {
                  setMessage(`Fehler: ${error.message}`)
                  setTimeout(() => setMessage(null), 5000)
                }
                setMessage(null)
              }}
            >
              <div>Teilpopulationen ohne Eintrag</div>
              <div>{'im Feld "Für AP-Bericht relevant"'}</div>
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "TeilpopulationenAnzahlMassnahmen" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVTpopAnzmassns {
                          nodes {
                            apId
                            familie
                            artname
                            apBearbeitung
                            apStartJahr
                            apUmsetzung
                            popId
                            popNr
                            popName
                            popStatus
                            popBekanntSeit
                            popStatusUnklar
                            popStatusUnklarBegruendung
                            popX
                            popY
                            id
                            nr
                            gemeinde
                            flurname
                            status
                            bekanntSeit
                            statusUnklar
                            statusUnklarGrund
                            x
                            y
                            radius
                            hoehe
                            exposition
                            klima
                            neigung
                            beschreibung
                            katasterNr
                            apberRelevant
                            eigentuemer
                            kontakt
                            nutzungszone
                            bewirtschafter
                            bewirtschaftung
                            anzahlMassnahmen
                          }
                        }
                      }`
                  })
                  exportModule({data: get(data, 'allVTpopAnzmassns.nodes', []), store, fileName: 'TeilpopulationenAnzahlMassnahmen'})
                } catch(error) {
                  setMessage(`Fehler: ${error.message}`)
                  setTimeout(() => setMessage(null), 5000)
                }
                setMessage(null)
              }}
            >
              Anzahl Massnahmen pro Teilpopulation
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "TeilpopulationenAnzKontrInklusiveLetzteKontrUndLetztenTPopBericht" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVTpopAnzkontrinklletzterundletztertpopbers {
                          nodes {
                            apId
                            familie
                            artname
                            apBearbeitung
                            apStartJahr
                            apUmsetzung
                            popId
                            popNr
                            popName
                            popStatus
                            popBekanntSeit
                            popStatusUnklar
                            popStatusUnklarBegruendung
                            popX
                            popY
                            id
                            nr
                            gemeinde
                            flurname
                            status
                            bekanntSeit
                            statusUnklar
                            statusUnklarGrund
                            x
                            y
                            radius
                            hoehe
                            exposition
                            klima
                            neigung
                            beschreibung
                            katasterNr
                            apberRelevant
                            eigentuemer
                            kontakt
                            nutzungszone
                            bewirtschafter
                            bewirtschaftung
                            changed
                            changedBy
                            kontrId
                            kontrJahr
                            kontrDatum
                            kontrTyp
                            kontrBearbeiter
                            kontrUeberlebensrate
                            kontrVitalitaet
                            kontrEntwicklung
                            kontrUrsachen
                            kontrErfolgsbeurteilung
                            kontrUmsetzungAendern
                            kontrKontrolleAendern
                            kontrBemerkungen
                            kontrLrDelarze
                            kontrLrUmgebungDelarze
                            kontrVegetationstyp
                            kontrKonkurrenz
                            kontrMoosschicht
                            kontrKrautschicht
                            kontrStrauchschicht
                            kontrBaumschicht
                            kontrBodenTyp
                            kontrBodenKalkgehalt
                            kontrBodenDurchlaessigkeit
                            kontrBodenHumus
                            kontrBodenNaehrstoffgehalt
                            kontrBodenAbtrag
                            kontrWasserhaushalt
                            kontrIdealbiotopUebereinstimmung
                            kontrHandlungsbedarf
                            kontrFlaecheUeberprueft
                            kontrFlaeche
                            kontrPlanVorhanden
                            kontrDeckungVegetation
                            kontrDeckungNackterBoden
                            kontrDeckungApArt
                            kontrJungpflanzenVorhanden
                            kontrVegetationshoeheMaximum
                            kontrVegetationshoeheMittel
                            kontrGefaehrdung
                            kontrChanged
                            kontrChangedBy
                            tpopberAnz
                            tpopberId
                            tpopberJahr
                            tpopberEntwicklung
                            tpopberBemerkungen
                            tpopberChanged
                            tpopberChangedBy
                          }
                        }
                      }`
                  })
                  exportModule({data: get(data, 'allVTpopAnzkontrinklletzterundletztertpopbers.nodes', []), store, fileName: 'TeilpopulationenAnzKontrInklusiveLetzteKontrUndLetztenTPopBericht'})
                } catch(error) {
                  setMessage(`Fehler: ${error.message}`)
                  setTimeout(() => setMessage(null), 5000)
                }
                setMessage(null)
              }}
              disabled={isRemoteHost}
              title={
                isRemoteHost ? 'nur aktiv, wenn apflora lokal installiert wird' : ''
              }
            >
              <div>Teilpopulationen mit:</div>
              <ul
                style={{
                  paddingLeft: '18px',
                  marginTop: '5px',
                  marginBottom: '10px',
                }}
              >
                <li>Anzahl Kontrollen</li>
                <li>letzte Kontrolle</li>
                <li>letzter Teilpopulationsbericht</li>
                <li>letzte Zählung</li>
              </ul>
              <div>{'= "Eier legende Wollmilchsau"'}</div>
            </DownloadCardButton>
            <AutocompleteContainer>
              <AutoComplete
                label={`"Eier legende Wollmilchsau" für eine Art`}
                objects={artList}
                store={store}
                openabove
              />
            </AutocompleteContainer>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "TeilpopulationenTPopUndMassnBerichte" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVTpopPopberundmassnbers {
                          nodes {
                            apId
                            artname
                            apBearbeitung
                            apStartJahr
                            apUmsetzung
                            popId
                            popNr
                            popName
                            popStatus
                            popBekanntSeit
                            popStatusUnklar
                            popStatusUnklarBegruendung
                            popX
                            popY
                            tpopId
                            tpopNr
                            tpopGemeinde
                            tpopFlurname
                            tpopStatus
                            tpopBekanntSeit
                            tpopStatusUnklar
                            tpopStatusUnklarGrund
                            tpopX
                            tpopY
                            tpopRadius
                            tpopHoehe
                            tpopExposition
                            tpopKlima
                            tpopNeigung
                            tpopBeschreibung
                            tpopKatasterNr
                            tpopApberRelevant
                            tpopEigentuemer
                            tpopKontakt
                            tpopNutzungszone
                            tpopBewirtschafter
                            tpopBewirtschaftung
                            tpopberId
                            tpopberJahr
                            tpopberEntwicklung
                            tpopberBemerkungen
                            tpopberChanged
                            tpopberChangedBy
                            tpopmassnberId
                            tpopmassnberJahr
                            tpopmassnberEntwicklung
                            tpopmassnberBemerkungen
                            tpopmassnberChanged
                            tpopmassnberChangedBy
                          }
                        }
                      }`
                  })
                  exportModule({data: get(data, 'allVTpopPopberundmassnbers.nodes', []), store, fileName: 'TeilpopulationenTPopUndMassnBerichte'})
                } catch(error) {
                  setMessage(`Fehler: ${error.message}`)
                  setTimeout(() => setMessage(null), 5000)
                }
                setMessage(null)
              }}
            >
              Teilpopulationen inklusive Teilpopulations- und Massnahmen-Berichten
            </DownloadCardButton>
          </StyledCardContent>
        </Collapse>
        {
          !!message &&
          <Message message={message} />
        }
      </StyledCard>
    }
  </ApolloConsumer>
)

export default enhance(Teilpopulationen)

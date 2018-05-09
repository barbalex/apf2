// @flow
import React from 'react'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Collapse from 'material-ui/transitions/Collapse'
import IconButton from 'material-ui/IconButton'
import Icon from 'material-ui/Icon'
import Button from 'material-ui/Button'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import styled from 'styled-components'
import { ApolloConsumer } from 'react-apollo'
import gql from "graphql-tag"
import get from 'lodash/get'

import exportModule from '../../../modules/exportGql'
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

const enhance = compose(
  withState('expanded', 'setExpanded', false),
  withState('message', 'setMessage', null)
)

const Populationen = ({
  store,
  expanded,
  setExpanded,
  message,
  setMessage,
  downloadFromView,
}: {
  store:Object,
  expanded: Boolean,
  setExpanded: () => void,
  message: String,
  setMessage: () => void,
  downloadFromView: () => void,
}) => (
  <ApolloConsumer>
    {client =>
      <StyledCard>
        <StyledCardActions
          disableActionSpacing
          onClick={() => setExpanded(!expanded)}
        >
          <CardActionTitle>Populationen</CardActionTitle>
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
                setMessage('Export "Populationen" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVPops {
                          nodes {
                            apId
                            artname
                            apBearbeitung
                            apStartJahr
                            apUmsetzung
                            id
                            nr
                            name
                            status
                            bekanntSeit
                            statusUnklar
                            statusUnklarBegruendung
                            x
                            y
                            changed
                            changedBy
                          }
                        }
                      }`
                  })
                  exportModule({data: get(data, 'allVPops.nodes', []), store, fileName: 'Populationen'})
                } catch(error) {
                  setMessage(`Fehler: ${error.message}`)
                  setTimeout(() => setMessage(null), 5000)
                }
                setMessage(null)
              }}
              onClick={() =>
                downloadFromView({
                  view: 'v_pop',
                  fileName: 'Populationen',
                })
              }
            >
              Populationen
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "Populationen" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVPopKmls {
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
                  exportModule({data: get(data, 'allVPopKmls.nodes', []), store, fileName: 'Populationen'})
                } catch(error) {
                  setMessage(`Fehler: ${error.message}`)
                  setTimeout(() => setMessage(null), 5000)
                }
                setMessage(null)
              }}
            >
              <div>Populationen für Google Earth (beschriftet mit PopNr)</div>
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "PopulationenNachNamen" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVPopKmlnamen {
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
                  exportModule({data: get(data, 'allVPopKmlnamen.nodes', []), store, fileName: 'PopulationenNachNamen'})
                } catch(error) {
                  setMessage(`Fehler: ${error.message}`)
                  setTimeout(() => setMessage(null), 5000)
                }
                setMessage(null)
              }}
            >
              <div>
                Populationen für Google Earth (beschriftet mit Artname, PopNr)
              </div>
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "PopulationenVonApArtenOhneStatus" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVPopVonapohnestatuses {
                          nodes {
                            apId
                            artname
                            apBearbeitung
                            id
                            nr
                            name
                            status
                          }
                        }
                      }`
                  })
                  exportModule({data: get(data, 'allVPopVonapohnestatuses.nodes', []), store, fileName: 'PopulationenVonApArtenOhneStatus'})
                } catch(error) {
                  setMessage(`Fehler: ${error.message}`)
                  setTimeout(() => setMessage(null), 5000)
                }
                setMessage(null)
              }}
            >
              Populationen von AP-Arten ohne Status
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "PopulationenOhneKoordinaten" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVPopOhnekoords {
                          nodes {
                            apId
                            artname
                            apBearbeitung
                            apStartJahr
                            apUmsetzung
                            id
                            nr
                            name
                            status
                            bekanntSeit
                            statusUnklar
                            statusUnklarBegruendung
                            x
                            y
                            changed
                            changedBy
                          }
                        }
                      }`
                  })
                  exportModule({data: get(data, 'allVPopOhnekoords.nodes', []), store, fileName: 'PopulationenOhneKoordinaten'})
                } catch(error) {
                  setMessage(`Fehler: ${error.message}`)
                  setTimeout(() => setMessage(null), 5000)
                }
                setMessage(null)
              }}
            >
              Populationen ohne Koordinaten
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "PopulationenAnzMassnProMassnber" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVPopmassnberAnzmassns {
                          nodes {
                            apId
                            artname
                            apStatus
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
                            popChanged
                            popChangedBy
                            popmassnberId
                            popmassnberJahr
                            popmassnberEntwicklung
                            popmassnberBemerkungen
                            popmassnberChanged
                            popmassnberChangedBy
                            anzahlMassnahmen
                          }
                        }
                      }`
                  })
                  exportModule({data: get(data, 'allVPopmassnberAnzmassns.nodes', []), store, fileName: 'PopulationenAnzMassnProMassnber'})
                } catch(error) {
                  setMessage(`Fehler: ${error.message}`)
                  setTimeout(() => setMessage(null), 5000)
                }
                setMessage(null)
              }}
            >
              Populationen mit Massnahmen-Berichten: Anzahl Massnahmen im
              Berichtsjahr
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "PopulationenAnzahlMassnahmen" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVPopAnzmassns {
                          nodes {
                            apId
                            artname
                            apBearbeitung
                            apStartJahr
                            apUmsetzung
                            id
                            nr
                            name
                            status
                            bekanntSeit
                            statusUnklar
                            statusUnklarBegruendung
                            x
                            y
                            anzahlMassnahmen
                          }
                        }
                      }`
                  })
                  exportModule({data: get(data, 'allVPopAnzmassns.nodes', []), store, fileName: 'PopulationenAnzahlMassnahmen'})
                } catch(error) {
                  setMessage(`Fehler: ${error.message}`)
                  setTimeout(() => setMessage(null), 5000)
                }
                setMessage(null)
              }}
            >
              Anzahl Massnahmen pro Population
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "PopulationenAnzahlKontrollen" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVPopAnzkontrs {
                          nodes {
                            apId
                            artname
                            apBearbeitung
                            apStartJahr
                            apUmsetzung
                            id
                            nr
                            name
                            status
                            bekanntSeit
                            statusUnklar
                            statusUnklarBegruendung
                            x
                            y
                            anzahlKontrollen
                          }
                        }
                      }`
                  })
                  exportModule({data: get(data, 'allVPopAnzkontrs.nodes', []), store, fileName: 'PopulationenAnzahlKontrollen'})
                } catch(error) {
                  setMessage(`Fehler: ${error.message}`)
                  setTimeout(() => setMessage(null), 5000)
                }
                setMessage(null)
              }}
            >
              Anzahl Kontrollen pro Population
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "PopulationenPopUndMassnBerichte" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVPopPopberundmassnbers {
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
                            popChanged
                            popChangedBy
                            jahr
                            popberId
                            popberJahr
                            popberEntwicklung
                            popberBemerkungen
                            popberChanged
                            popberChangedBy
                            popmassnberId
                            popmassnberJahr
                            popmassnberEntwicklung
                            popmassnberBemerkungen
                            popmassnberChanged
                            popmassnberChangedBy
                          }
                        }
                      }`
                  })
                  exportModule({data: get(data, 'allVPopPopberundmassnbers.nodes', []), store, fileName: 'PopulationenPopUndMassnBerichte'})
                } catch(error) {
                  setMessage(`Fehler: ${error.message}`)
                  setTimeout(() => setMessage(null), 5000)
                }
                setMessage(null)
              }}
            >
              Populationen inkl. Populations- und Massnahmen-Berichte
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "PopulationenMitLetzemPopBericht" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVPopMitLetzterPopbers {
                          nodes {
                            apId
                            artname
                            apStatus
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
                            popChanged
                            popChangedBy
                            popberId
                            popberJahr
                            popberEntwicklung
                            popberBemerkungen
                            popberChanged
                            popberChangedBy
                          }
                        }
                      }`
                  })
                  exportModule({data: get(data, 'allVPopMitLetzterPopbers.nodes', []), store, fileName: 'PopulationenMitLetzemPopBericht'})
                } catch(error) {
                  setMessage(`Fehler: ${error.message}`)
                  setTimeout(() => setMessage(null), 5000)
                }
                setMessage(null)
              }}
            >
              Populationen mit dem letzten Populations-Bericht
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "PopulationenMitLetztemMassnBericht" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVPopMitLetzterPopmassnbers {
                          nodes {
                            apId
                            artname
                            apStatus
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
                            popChanged
                            popChangedBy
                            popmassnberId
                            popmassnberJahr
                            popmassnberEntwicklung
                            popmassnberBemerkungen
                            popmassnberChanged
                            popmassnberChangedBy
                          }
                        }
                      }`
                  })
                  exportModule({data: get(data, 'allVPopMitLetzterPopmassnbers.nodes', []), store, fileName: 'allVPopMitLetzterPopmassnbers'})
                } catch(error) {
                  setMessage(`Fehler: ${error.message}`)
                  setTimeout(() => setMessage(null), 5000)
                }
                setMessage(null)
              }}
            >
              Populationen mit dem letzten Massnahmen-Bericht
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

export default enhance(Populationen)

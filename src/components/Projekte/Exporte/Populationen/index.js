// @flow
import React from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import styled from 'styled-components'
import { ApolloConsumer } from 'react-apollo'
import get from 'lodash/get'
import { Subscribe } from 'unstated'

import exportModule from '../../../../modules/export'
import Message from '../Message'
import ErrorState from '../../../../state/Error'
import epsg2056to4326 from '../../../../modules/epsg2056to4326'

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
  withState('message', 'setMessage', null),
)

const Populationen = ({
  fileType,
  mapFilter,
  applyMapFilterToExport,
  client,
  expanded,
  setExpanded,
  message,
  setMessage,
}: {
  fileType: String,
  applyMapFilterToExport: Boolean,
  mapFilter: Object,
  client: Object,
  expanded: Boolean,
  setExpanded: () => void,
  message: String,
  setMessage: () => void,
}) => (
  <Subscribe to={[ErrorState]}>
    {errorState =>
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
                        query: await import('./allVPops.graphql')
                      })
                      exportModule({
                        data: get(data, 'allVPops.nodes', []),
                        fileName: 'Populationen',
                        fileType,
                        mapFilter,
                        applyMapFilterToExport,
                        idKey: 'id',
                        xKey: 'x',
                        yKey: 'y',
                        errorState,
                      })
                    } catch(error) {
                      errorState.add(error)
                    }
                    setMessage(null)
                  }}
                >
                  Populationen
                </DownloadCardButton>
                <DownloadCardButton
                  onClick={async () => {
                    setMessage('Export "Populationen" wird vorbereitet...')
                    try {
                      const { data } = await client.query({
                        query: await import('./allVPopKmls.graphql')
                      })
                      const enrichedData = get(data, 'allVPopKmls.nodes', [])
                        .map(oWithout => {
                          let o = {...oWithout}
                          const [bg, lg] = epsg2056to4326(o.x, o.y)
                          o.laengengrad = lg
                          o.breitengrad = bg
                          return o
                        })
                      exportModule({
                        data: enrichedData,
                        fileName: 'Populationen',
                        fileType,
                        mapFilter,
                        applyMapFilterToExport,
                        idKey: 'id',
                        xKey: 'x',
                        yKey: 'y',
                        errorState,
                        kml: true,
                      })
                    } catch(error) {
                      errorState.add(error)
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
                        query: await import('./allVPopKmlnamen.graphql')
                      })
                      const enrichedData = get(data, 'allVPopKmlnamen.nodes', [])
                        .map(oWithout => {
                          let o = {...oWithout}
                          const [bg, lg] = epsg2056to4326(o.x, o.y)
                          o.laengengrad = lg
                          o.breitengrad = bg
                          return o
                        })
                      exportModule({
                        data: enrichedData,
                        fileName: 'PopulationenNachNamen',
                        fileType,
                        mapFilter,
                        applyMapFilterToExport,
                        idKey: 'id',
                        xKey: 'x',
                        yKey: 'y',
                        errorState,
                        kml: true,
                      })
                    } catch(error) {
                      errorState.add(error)
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
                        query: await import('./allVPopVonapohnestatuses.graphql')
                      })
                      exportModule({
                        data: get(data, 'allVPopVonapohnestatuses.nodes', []),
                        fileName: 'PopulationenVonApArtenOhneStatus',
                        fileType,
                        mapFilter,
                        applyMapFilterToExport,
                        idKey: 'id',
                        xKey: 'x',
                        yKey: 'y',
                        errorState,
                      })
                    } catch(error) {
                      errorState.add(error)
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
                        query: await import('./allVPopOhnekoords.graphql')
                      })
                      exportModule({
                        data: get(data, 'allVPopOhnekoords.nodes', []),
                        fileName: 'PopulationenOhneKoordinaten',
                        fileType,
                        mapFilter,
                        applyMapFilterToExport,
                        errorState,
                      })
                    } catch(error) {
                      errorState.add(error)
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
                        query: await import('./allVPopmassnberAnzmassns.graphql')
                      })
                      exportModule({
                        data: get(data, 'allVPopmassnberAnzmassns.nodes', []),
                        fileName: 'PopulationenAnzMassnProMassnber',
                        fileType,
                        mapFilter,
                        applyMapFilterToExport,
                        idKey: 'pop_id',
                        xKey: 'pop_x',
                        yKey: 'pop_y',
                        errorState,
                      })
                    } catch(error) {
                      errorState.add(error)
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
                        query: await import('./allVPopAnzmassns.graphql')
                      })
                      exportModule({
                        data: get(data, 'allVPopAnzmassns.nodes', []),
                        fileName: 'PopulationenAnzahlMassnahmen',
                        fileType,
                        mapFilter,
                        applyMapFilterToExport,
                        idKey: 'id',
                        xKey: 'x',
                        yKey: 'y',
                        errorState,
                      })
                    } catch(error) {
                      errorState.add(error)
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
                        query: await import('./allVPopAnzkontrs.graphql')
                      })
                      exportModule({
                        data: get(data, 'allVPopAnzkontrs.nodes', []),
                        fileName: 'PopulationenAnzahlKontrollen',
                        fileType,
                        mapFilter,
                        applyMapFilterToExport,
                        idKey: 'id',
                        xKey: 'x',
                        yKey: 'y',
                        errorState,
                      })
                    } catch(error) {
                      errorState.add(error)
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
                        query: await import('./allVPopPopberundmassnbers.graphql')
                      })
                      exportModule({
                        data: get(data, 'allVPopPopberundmassnbers.nodes', []),
                        fileName: 'PopulationenPopUndMassnBerichte',
                        fileType,
                        mapFilter,
                        applyMapFilterToExport,
                        idKey: 'pop_id',
                        xKey: 'pop_x',
                        yKey: 'pop_y',
                        errorState,
                      })
                    } catch(error) {
                      errorState.add(error)
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
                        query: await import('./allVPopMitLetzterPopbers.graphql')
                      })
                      exportModule({
                        data: get(data, 'allVPopMitLetzterPopbers.nodes', []),
                        fileName: 'PopulationenMitLetzemPopBericht',
                        fileType,
                        mapFilter,
                        applyMapFilterToExport,
                        idKey: 'pop_id',
                        xKey: 'pop_x',
                        yKey: 'pop_y',
                        errorState,
                      })
                    } catch(error) {
                      errorState.add(error)
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
                        query: await import('./allVPopMitLetzterPopmassnbers.graphql')
                      })
                      exportModule({
                        data: get(data, 'allVPopMitLetzterPopmassnbers.nodes', []),
                        fileName: 'allVPopMitLetzterPopmassnbers',
                        fileType,
                        mapFilter,
                        applyMapFilterToExport,
                        idKey: 'pop_id',
                        xKey: 'pop_x',
                        yKey: 'pop_y',
                        errorState,
                      })
                    } catch(error) {
                      errorState.add(error)
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
    }
  </Subscribe>
)

export default enhance(Populationen)

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

import exportModule from '../../../../modules/export'
import Message from '../Message'
import withErrorState from '../../../../state/withErrorState'

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
  withErrorState,
  withState('expanded', 'setExpanded', false),
  withState('message', 'setMessage', null),
)

const AP = ({
  fileType,
  applyMapFilterToExport,
  client,
  expanded,
  setExpanded,
  message,
  setMessage,
  mapFilter,
  errorState,
}: {
  fileType: String,
  applyMapFilterToExport: Boolean,
  client: Object,
  expanded: Boolean,
  setExpanded: () => void,
  message: String,
  setMessage: () => void,
  mapFilter: Object,
  errorState: Object,
}) => (
  <ApolloConsumer>
    {client => (
      <StyledCard>
        <StyledCardActions
          disableActionSpacing
          onClick={() => setExpanded(!expanded)}
        >
          <CardActionTitle>Aktionsplan</CardActionTitle>
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
                setMessage('Export "AP" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: await import('./allVAps'),
                  })
                  exportModule({
                    data: get(data, 'allVAps.nodes', []),
                    fileName: 'AP',
                    fileType,
                    applyMapFilterToExport,
                    mapFilter,
                    errorState,
                  })
                } catch (error) {
                  errorState.add(error)
                }
                setMessage(null)
              }}
            >
              Aktionspläne
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "ApOhnePopulationen" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: await import('./allVApOhnepops'),
                  })
                  exportModule({
                    data: get(data, 'allVApOhnepops.nodes', []),
                    fileName: 'ApOhnePopulationen',
                    fileType,
                    applyMapFilterToExport,
                    mapFilter,
                    errorState,
                  })
                } catch (error) {
                  errorState.add(error)
                }
                setMessage(null)
              }}
            >
              Aktionspläne ohne Populationen
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "ApAnzahlMassnahmen" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: await import('./allVApAnzmassns'),
                  })
                  exportModule({
                    data: get(data, 'allVApAnzmassns.nodes', []),
                    fileName: 'ApAnzahlMassnahmen',
                    fileType,
                    applyMapFilterToExport,
                    mapFilter,
                    errorState,
                  })
                } catch (error) {
                  errorState.add(error)
                }
                setMessage(null)
              }}
            >
              Anzahl Massnahmen pro Aktionsplan
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "ApAnzahlKontrollen" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: await import('./allVApAnzkontrs'),
                  })
                  exportModule({
                    data: get(data, 'allVApAnzkontrs.nodes', []),
                    fileName: 'ApAnzahlKontrollen',
                    fileType,
                    applyMapFilterToExport,
                    mapFilter,
                    errorState,
                  })
                } catch (error) {
                  errorState.add(error)
                }
                setMessage(null)
              }}
            >
              Anzahl Kontrollen pro Aktionsplan
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "Jahresberichte" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: await import('./allVApbers'),
                  })
                  exportModule({
                    data: get(data, 'allVApbers.nodes', []),
                    fileName: 'Jahresberichte',
                    fileType,
                    applyMapFilterToExport,
                    mapFilter,
                    errorState,
                  })
                } catch (error) {
                  errorState.add(error)
                }
                setMessage(null)
              }}
            >
              AP-Berichte (Jahresberichte)
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage(
                  'Export "ApJahresberichteUndMassnahmen" wird vorbereitet...',
                )
                try {
                  const { data } = await client.query({
                    query: await import('./allVApApberundmassns'),
                  })
                  exportModule({
                    data: get(data, 'allVApApberundmassns.nodes', []),
                    fileName: 'ApJahresberichteUndMassnahmen',
                    fileType,
                    applyMapFilterToExport,
                    mapFilter,
                    errorState,
                  })
                } catch (error) {
                  errorState.add(error)
                }
                setMessage(null)
              }}
            >
              AP-Berichte und Massnahmen
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "ApZiele" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: await import('./allVZiels'),
                  })
                  exportModule({
                    data: get(data, 'allVZiels.nodes', []),
                    fileName: 'ApZiele',
                    fileType,
                    applyMapFilterToExport,
                    mapFilter,
                    errorState,
                  })
                } catch (error) {
                  errorState.add(error)
                }
                setMessage(null)
              }}
            >
              Ziele
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "Zielberichte" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: await import('./allVZielbers'),
                  })
                  exportModule({
                    data: get(data, 'allVZielbers.nodes', []),
                    fileName: 'Zielberichte',
                    fileType,
                    applyMapFilterToExport,
                    mapFilter,
                    errorState,
                  })
                } catch (error) {
                  errorState.add(error)
                }
                setMessage(null)
              }}
            >
              Ziel-Berichte
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "Berichte" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: await import('./allVBers'),
                  })
                  exportModule({
                    data: get(data, 'allVBers.nodes', []),
                    fileName: 'Berichte',
                    fileType,
                    applyMapFilterToExport,
                    mapFilter,
                    errorState,
                  })
                } catch (error) {
                  errorState.add(error)
                }
                setMessage(null)
              }}
            >
              Berichte
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "Erfolgskriterien" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: await import('./allVErfkrits'),
                  })
                  exportModule({
                    data: get(data, 'allVErfkrits.nodes', []),
                    fileName: 'Erfolgskriterien',
                    fileType,
                    applyMapFilterToExport,
                    mapFilter,
                    errorState,
                  })
                } catch (error) {
                  errorState.add(error)
                }
                setMessage(null)
              }}
            >
              Erfolgskriterien
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "Idealbiotope" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: await import('./allVIdealbiotops'),
                  })
                  exportModule({
                    data: get(data, 'allVIdealbiotops.nodes', []),
                    fileName: 'Idealbiotope',
                    fileType,
                    applyMapFilterToExport,
                    mapFilter,
                    errorState,
                  })
                } catch (error) {
                  errorState.add(error)
                }
                setMessage(null)
              }}
            >
              Idealbiotope
            </DownloadCardButton>
            <DownloadCardButton
              onClick={async () => {
                setMessage('Export "AssoziierteArten" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: await import('./allVAssozarts'),
                  })
                  exportModule({
                    data: get(data, 'allVAssozarts.nodes', []),
                    fileName: 'AssoziierteArten',
                    fileType,
                    applyMapFilterToExport,
                    mapFilter,
                    errorState,
                  })
                } catch (error) {
                  errorState.add(error)
                }
                setMessage(null)
              }}
            >
              Assoziierte Arten
            </DownloadCardButton>
          </StyledCardContent>
        </Collapse>
        {!!message && <Message message={message} />}
      </StyledCard>
    )}
  </ApolloConsumer>
)

export default enhance(AP)

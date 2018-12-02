// @flow
import React, { useContext, useState, useCallback } from 'react'
import compose from 'recompose/compose'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from 'react-apollo-hooks'

import exportModule from '../../../../modules/export'
import Message from '../Message'
import mobxStoreContext from '../../../../mobxStoreContext'

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
  observer,
)

const AP = () => {
  const client = useApolloClient()
  const mobxStore = useContext(mobxStoreContext)
  const {
    mapFilter,
    addError,
    exportApplyMapFilter,
    exportFileType,
  } = mobxStore

  const [expanded, setExpanded] = useState(false)
  const [message, setMessage] = useState(null)

  const onClickAction = useCallback(() => setExpanded(!expanded), [expanded])
  const onClickAp = useCallback(
    async () => {
      setMessage('Export "AP" wird vorbereitet...')
      try {
        const { data } = await client.query({
          query: await import('./allVAps').then(m => m.default),
        })
        exportModule({
          data: get(data, 'allVAps.nodes', []),
          fileName: 'AP',
          exportFileType,
          exportApplyMapFilter,
          mapFilter,
          addError,
        })
      } catch (error) {
        addError(error)
      }
      setMessage(null)
    },
    [exportFileType, exportApplyMapFilter, mapFilter],
  )
  const onClickApOhnePop = useCallback(
    async () => {
      setMessage('Export "ApOhnePopulationen" wird vorbereitet...')
      try {
        const { data } = await client.query({
          query: await import('./allVApOhnepops').then(m => m.default),
        })
        exportModule({
          data: get(data, 'allVApOhnepops.nodes', []),
          fileName: 'ApOhnePopulationen',
          exportFileType,
          exportApplyMapFilter,
          mapFilter,
          addError,
        })
      } catch (error) {
        addError(error)
      }
      setMessage(null)
    },
    [exportFileType, exportApplyMapFilter, mapFilter],
  )
  const onClickAnzMassnProAp = useCallback(
    async () => {
      setMessage('Export "ApAnzahlMassnahmen" wird vorbereitet...')
      try {
        const { data } = await client.query({
          query: await import('./allVApAnzmassns').then(m => m.default),
        })
        exportModule({
          data: get(data, 'allVApAnzmassns.nodes', []),
          fileName: 'ApAnzahlMassnahmen',
          exportFileType,
          exportApplyMapFilter,
          mapFilter,
          addError,
        })
      } catch (error) {
        addError(error)
      }
      setMessage(null)
    },
    [exportFileType, exportApplyMapFilter, mapFilter],
  )
  const onClickAnzKontrProAp = useCallback(
    async () => {
      setMessage('Export "ApAnzahlKontrollen" wird vorbereitet...')
      try {
        const { data } = await client.query({
          query: await import('./allVApAnzkontrs').then(m => m.default),
        })
        exportModule({
          data: get(data, 'allVApAnzkontrs.nodes', []),
          fileName: 'ApAnzahlKontrollen',
          exportFileType,
          exportApplyMapFilter,
          mapFilter,
          addError,
        })
      } catch (error) {
        addError(error)
      }
      setMessage(null)
    },
    [exportFileType, exportApplyMapFilter, mapFilter],
  )
  const onClickApBer = useCallback(
    async () => {
      setMessage('Export "Jahresberichte" wird vorbereitet...')
      try {
        const { data } = await client.query({
          query: await import('./allVApbers').then(m => m.default),
        })
        exportModule({
          data: get(data, 'allVApbers.nodes', []),
          fileName: 'Jahresberichte',
          exportFileType,
          exportApplyMapFilter,
          mapFilter,
          addError,
        })
      } catch (error) {
        addError(error)
      }
      setMessage(null)
    },
    [exportFileType, exportApplyMapFilter, mapFilter],
  )
  const onClickApBerUndMassn = useCallback(
    async () => {
      setMessage('Export "ApJahresberichteUndMassnahmen" wird vorbereitet...')
      try {
        const { data } = await client.query({
          query: await import('./allVApApberundmassns').then(m => m.default),
        })
        exportModule({
          data: get(data, 'allVApApberundmassns.nodes', []),
          fileName: 'ApJahresberichteUndMassnahmen',
          exportFileType,
          exportApplyMapFilter,
          mapFilter,
          addError,
        })
      } catch (error) {
        addError(error)
      }
      setMessage(null)
    },
    [exportFileType, exportApplyMapFilter, mapFilter],
  )
  const onClickZiele = useCallback(
    async () => {
      setMessage('Export "ApZiele" wird vorbereitet...')
      try {
        const { data } = await client.query({
          query: await import('./allVZiels').then(m => m.default),
        })
        exportModule({
          data: get(data, 'allVZiels.nodes', []),
          fileName: 'ApZiele',
          exportFileType,
          exportApplyMapFilter,
          mapFilter,
          addError,
        })
      } catch (error) {
        addError(error)
      }
      setMessage(null)
    },
    [exportFileType, exportApplyMapFilter, mapFilter],
  )
  const onClickZielber = useCallback(
    async () => {
      setMessage('Export "Zielberichte" wird vorbereitet...')
      try {
        const { data } = await client.query({
          query: await import('./allVZielbers').then(m => m.default),
        })
        exportModule({
          data: get(data, 'allVZielbers.nodes', []),
          fileName: 'Zielberichte',
          exportFileType,
          exportApplyMapFilter,
          mapFilter,
          addError,
        })
      } catch (error) {
        addError(error)
      }
      setMessage(null)
    },
    [exportFileType, exportApplyMapFilter, mapFilter],
  )
  const onClickBer = useCallback(
    async () => {
      setMessage('Export "Berichte" wird vorbereitet...')
      try {
        const { data } = await client.query({
          query: await import('./allVBers').then(m => m.default),
        })
        exportModule({
          data: get(data, 'allVBers.nodes', []),
          fileName: 'Berichte',
          exportFileType,
          exportApplyMapFilter,
          mapFilter,
          addError,
        })
      } catch (error) {
        addError(error)
      }
      setMessage(null)
    },
    [exportFileType, exportApplyMapFilter, mapFilter],
  )
  const onClickErfkrit = useCallback(
    async () => {
      setMessage('Export "Erfolgskriterien" wird vorbereitet...')
      try {
        const { data } = await client.query({
          query: await import('./allVErfkrits').then(m => m.default),
        })
        exportModule({
          data: get(data, 'allVErfkrits.nodes', []),
          fileName: 'Erfolgskriterien',
          exportFileType,
          exportApplyMapFilter,
          mapFilter,
          addError,
        })
      } catch (error) {
        addError(error)
      }
      setMessage(null)
    },
    [exportFileType, exportApplyMapFilter, mapFilter],
  )
  const onClickIdealbiotop = useCallback(
    async () => {
      setMessage('Export "Idealbiotope" wird vorbereitet...')
      try {
        const { data } = await client.query({
          query: await import('./allVIdealbiotops').then(m => m.default),
        })
        exportModule({
          data: get(data, 'allVIdealbiotops.nodes', []),
          fileName: 'Idealbiotope',
          exportFileType,
          exportApplyMapFilter,
          mapFilter,
          addError,
        })
      } catch (error) {
        addError(error)
      }
      setMessage(null)
    },
    [exportFileType, exportApplyMapFilter, mapFilter],
  )
  const onClickAssozarten = useCallback(
    async () => {
      setMessage('Export "AssoziierteArten" wird vorbereitet...')
      try {
        const { data } = await client.query({
          query: await import('./allVAssozarts').then(m => m.default),
        })
        exportModule({
          data: get(data, 'allVAssozarts.nodes', []),
          fileName: 'AssoziierteArten',
          exportFileType,
          exportApplyMapFilter,
          mapFilter,
          addError,
        })
      } catch (error) {
        addError(error)
      }
      setMessage(null)
    },
    [exportFileType, exportApplyMapFilter, mapFilter],
  )

  return (
    <StyledCard>
      <StyledCardActions disableActionSpacing onClick={onClickAction}>
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
          <DownloadCardButton onClick={onClickAp}>
            Aktionspläne
          </DownloadCardButton>
          <DownloadCardButton onClick={onClickApOhnePop}>
            Aktionspläne ohne Populationen
          </DownloadCardButton>
          <DownloadCardButton onClick={onClickAnzMassnProAp}>
            Anzahl Massnahmen pro Aktionsplan
          </DownloadCardButton>
          <DownloadCardButton onClick={onClickAnzKontrProAp}>
            Anzahl Kontrollen pro Aktionsplan
          </DownloadCardButton>
          <DownloadCardButton onClick={onClickApBer}>
            AP-Berichte (Jahresberichte)
          </DownloadCardButton>
          <DownloadCardButton onClick={onClickApBerUndMassn}>
            AP-Berichte und Massnahmen
          </DownloadCardButton>
          <DownloadCardButton onClick={onClickZiele}>Ziele</DownloadCardButton>
          <DownloadCardButton onClick={onClickZielber}>
            Ziel-Berichte
          </DownloadCardButton>
          <DownloadCardButton onClick={onClickBer}>Berichte</DownloadCardButton>
          <DownloadCardButton onClick={onClickErfkrit}>
            Erfolgskriterien
          </DownloadCardButton>
          <DownloadCardButton onClick={onClickIdealbiotop}>
            Idealbiotope
          </DownloadCardButton>
          <DownloadCardButton onClick={onClickAssozarten}>
            Assoziierte Arten
          </DownloadCardButton>
        </StyledCardContent>
      </Collapse>
      {!!message && <Message message={message} />}
    </StyledCard>
  )
}

export default enhance(AP)

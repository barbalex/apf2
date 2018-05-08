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

import AutoComplete from './Autocomplete'

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
  expanded,
  setExpanded,
  downloadFromView,
  artList,
}: {
  expanded: Boolean,
  setExpanded: () => void,
  downloadFromView: () => void,
  artList: Array<Object>,
}) => (
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
          onClick={() =>
            downloadFromView({
              view: 'v_tpop',
              fileName: 'Teilpopulationen',
            })
          }
        >
          Teilpopulationen
        </DownloadCardButton>
        <DownloadCardButton
          onClick={() =>
            downloadFromView({
              view: 'v_tpop_webgisbun',
              fileName: 'TeilpopulationenWebGisBun',
            })
          }
        >
          Teilpopulationen für WebGIS BUN
        </DownloadCardButton>
        <DownloadCardButton
          onClick={() =>
            downloadFromView({
              view: 'v_tpop_kml',
              fileName: 'Teilpopulationen',
              kml: true,
            })
          }
        >
          <div>Teilpopulationen für Google Earth</div>
          <div>(beschriftet mit PopNr/TPopNr)</div>
        </DownloadCardButton>
        <DownloadCardButton
          onClick={() =>
            downloadFromView({
              view: 'v_tpop_kmlnamen',
              fileName: 'TeilpopulationenNachNamen',
              kml: true,
            })
          }
        >
          <div>Teilpopulationen für Google Earth</div>
          <div>(beschriftet mit Artname, PopNr/TPopNr)</div>
        </DownloadCardButton>
        <DownloadCardButton
          onClick={() =>
            downloadFromView({
              view: 'v_tpop_ohnebekanntseit',
              fileName: 'TeilpopulationenVonApArtenOhneBekanntSeit',
            })
          }
        >
          <div>Teilpopulationen von AP-Arten</div>
          <div>{'ohne "Bekannt seit"'}</div>
        </DownloadCardButton>
        <DownloadCardButton
          onClick={() =>
            downloadFromView({
              view: 'v_tpop_ohneapberichtrelevant',
              fileName: 'TeilpopulationenOhneApBerichtRelevant',
            })
          }
        >
          <div>Teilpopulationen ohne Eintrag</div>
          <div>{'im Feld "Für AP-Bericht relevant"'}</div>
        </DownloadCardButton>
        <DownloadCardButton
          onClick={() =>
            downloadFromView({
              view: 'v_tpop_popnrtpopnrmehrdeutig',
              fileName: 'TeilpopulationenPopnrTpopnrMehrdeutig',
            })
          }
        >
          <div>Teilpopulationen mit mehrdeutiger</div>
          <div>Kombination von PopNr und TPopNr</div>
        </DownloadCardButton>
        <DownloadCardButton
          onClick={() =>
            downloadFromView({
              view: 'v_tpop_anzmassn',
              fileName: 'TeilpopulationenAnzahlMassnahmen',
            })
          }
        >
          Anzahl Massnahmen pro Teilpopulation
        </DownloadCardButton>
        <DownloadCardButton
          onClick={() =>
            downloadFromView({
              view: 'v_tpop_anzkontrinklletzterundletztertpopber',
              fileName:
                'TeilpopulationenAnzKontrInklusiveLetzteKontrUndLetztenTPopBericht',
            })
          }
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
            downloadFromView={downloadFromView}
          />
        </AutocompleteContainer>
        <DownloadCardButton
          onClick={() =>
            downloadFromView({
              view: 'v_tpop_popberundmassnber',
              fileName: 'TeilpopulationenTPopUndMassnBerichte',
            })
          }
        >
          Teilpopulationen inklusive Teilpopulations- und Massnahmen-Berichten
        </DownloadCardButton>
      </StyledCardContent>
    </Collapse>
  </StyledCard>
)

export default enhance(Teilpopulationen)

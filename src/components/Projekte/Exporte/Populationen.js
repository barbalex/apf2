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
              onClick={() =>
                downloadFromView({
                  view: 'v_pop_kml',
                  fileName: 'Populationen',
                })
              }
            >
              <div>Populationen für Google Earth (beschriftet mit PopNr)</div>
            </DownloadCardButton>
            <DownloadCardButton
              onClick={() =>
                downloadFromView({
                  view: 'v_pop_kmlnamen',
                  fileName: 'PopulationenNachNamen',
                })
              }
            >
              <div>
                Populationen für Google Earth (beschriftet mit Artname, PopNr)
              </div>
            </DownloadCardButton>
            <DownloadCardButton
              onClick={() =>
                downloadFromView({
                  view: 'v_pop_vonapohnestatus',
                  fileName: 'PopulationenVonApArtenOhneStatus',
                })
              }
            >
              Populationen von AP-Arten ohne Status
            </DownloadCardButton>
            <DownloadCardButton
              onClick={() =>
                downloadFromView({
                  view: 'v_pop_ohnekoord',
                  fileName: 'PopulationenOhneKoordinaten',
                })
              }
            >
              Populationen ohne Koordinaten
            </DownloadCardButton>
            <DownloadCardButton
              onClick={() =>
                downloadFromView({
                  view: 'v_popmassnber_anzmassn',
                  fileName: 'PopulationenAnzMassnProMassnber',
                })
              }
            >
              Populationen mit Massnahmen-Berichten: Anzahl Massnahmen im
              Berichtsjahr
            </DownloadCardButton>
            <DownloadCardButton
              onClick={() =>
                downloadFromView({
                  view: 'v_pop_anzmassn',
                  fileName: 'PopulationenAnzahlMassnahmen',
                })
              }
            >
              Anzahl Massnahmen pro Population
            </DownloadCardButton>
            <DownloadCardButton
              onClick={() =>
                downloadFromView({
                  view: 'v_pop_anzkontr',
                  fileName: 'PopulationenAnzahlKontrollen',
                })
              }
            >
              Anzahl Kontrollen pro Population
            </DownloadCardButton>
            <DownloadCardButton
              onClick={() =>
                downloadFromView({
                  view: 'v_pop_popberundmassnber',
                  fileName: 'PopulationenPopUndMassnBerichte',
                })
              }
            >
              Populationen inkl. Populations- und Massnahmen-Berichte
            </DownloadCardButton>
            <DownloadCardButton
              onClick={() =>
                downloadFromView({
                  view: 'v_pop_mit_letzter_popber',
                  fileName: 'PopulationenMitLetzemPopBericht',
                })
              }
            >
              Populationen mit dem letzten Populations-Bericht
            </DownloadCardButton>
            <DownloadCardButton
              onClick={() =>
                downloadFromView({
                  view: 'v_pop_mit_letzter_popmassnber',
                  fileName: 'PopulationenMitLetztemMassnBericht',
                })
              }
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

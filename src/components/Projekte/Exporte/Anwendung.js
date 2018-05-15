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
import { inject } from 'mobx-react'

import beziehungen from '../../../etc/beziehungen.png'
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

const enhance = compose(
  withState('expanded', 'setExpanded', false),
  withState('message', 'setMessage', null),
  inject('store')
)

const Anwendung = ({
  store,
  expanded,
  setExpanded,
  message,
  setMessage,
}: {
  store:Object,
  expanded: Boolean,
  setExpanded: () => void,
  message: String,
  setMessage: () => void,
}) => (
  <ApolloConsumer>
    {client =>
  <StyledCard>
    <StyledCardActions
      disableActionSpacing
      onClick={() => setExpanded(!expanded)}
    >
      <CardActionTitle>Anwendung</CardActionTitle>
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
            setMessage('Export "Datenstruktur" wird vorbereitet...')
            try {
              const { data } = await client.query({
                query: gql`
                  query view {
                    allVDatenstrukturs {
                      nodes {
                        tabelle_schema: tabelleSchema
                        tabelle_name: tabelleName
                        tabelle_anzahl_datensaetze: tabelleAnzahlDatensaetze
                        feld_name: feldName
                        feld_standardwert: feldStandardwert
                        feld_datentyp: feldDatentyp
                        feld_nullwerte: feldNullwerte
                      }
                    }
                  }`
              })
              exportModule({data: get(data, 'allVDatenstrukturs.nodes', []), store, fileName: 'Datenstruktur'})
            } catch(error) {
              setMessage(`Fehler: ${error.message}`)
              setTimeout(() => setMessage(null), 5000)
            }
            setMessage(null)
          }}
        >
          Tabellen und Felder
        </DownloadCardButton>
        <DownloadCardButton
          onClick={() => {
            window.open(beziehungen)
          }}
        >
          Datenstruktur grafisch dargestellt
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

export default enhance(Anwendung)

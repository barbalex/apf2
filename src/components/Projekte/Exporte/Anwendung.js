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
import gql from 'graphql-tag'
import get from 'lodash/get'
import app from 'ampersand-app'

import beziehungen from '../../../etc/beziehungen.png'
import exportModule from '../../../modules/export'
import Message from './Message'
import withErrorState from '../../../state/withErrorState'

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

const Anwendung = ({
  fileType,
  applyMapFilterToExport,
  client,
  expanded,
  setExpanded,
  message,
  setMessage,
  errorState,
}: {
  fileType: String,
  applyMapFilterToExport: Boolean,
  client: Object,
  expanded: Boolean,
  setExpanded: () => void,
  message: String,
  setMessage: () => void,
  errorState: Object,
}) => (
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
              const { data } = await app.client.query({
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
                  }
                `,
              })
              exportModule({
                data: get(data, 'allVDatenstrukturs.nodes', []),
                fileName: 'Datenstruktur',
                fileType,
                applyMapFilterToExport,
                errorState,
              })
            } catch (error) {
              errorState.add(error)
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
    {!!message && <Message message={message} />}
  </StyledCard>
)

export default enhance(Anwendung)

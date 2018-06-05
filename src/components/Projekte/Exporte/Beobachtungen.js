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
import gql from "graphql-tag"
import get from 'lodash/get'
import { inject } from 'mobx-react'

import exportModule from '../../../modules/export'
import listError from '../../../modules/listError'
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

const Beobachtungen = ({
  store,
  fileType,
  applyMapFilterToExport,
  mapFilter,
  client,
  expanded,
  setExpanded,
  message,
  setMessage,
}: {
  store: Object,
  fileType: String,
  applyMapFilterToExport: Boolean,
  mapFilter: Object,
  client: Object,
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
          <CardActionTitle>Beobachtungen</CardActionTitle>
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
                setMessage('Export "Beobachtungen" wird vorbereitet...')
                try {
                  const { data } = await client.query({
                    query: gql`
                      query view {
                        allVBeobs {
                          nodes {
                            id
                            quelle
                            id_field: idField
                            original_id: originalId
                            art_id: artId
                            artname
                            pop_id: popId
                            pop_nr: popNr
                            tpop_id: tpopId
                            tpop_nr: tpopNr
                            x
                            y
                            distanz_zur_teilpopulation: distanzZurTeilpopulation
                            datum
                            autor
                            nicht_zuordnen: nichtZuordnen
                            bemerkungen
                            changed
                            changed_by: changedBy
                          }
                        }
                      }`
                  })
                  exportModule({
                    data: get(data, 'allVBeobs.nodes', []),
                    fileName: 'Beobachtungen',
                    fileType,
                    applyMapFilterToExport,
                    mapFilter,
                    idKey: 'id',
                    xKey: 'x',
                    yKey: 'y',
                  })
                } catch(error) {
                  listError(error)
                }
                setMessage(null)
              }}
            >
              <div>Alle Beobachtungen von Arten aus apflora.ch</div>
              <div>Nutzungsbedingungen der FNS beachten</div>
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

export default enhance(Beobachtungen)

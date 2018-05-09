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

const enhance = compose(withState('expanded', 'setExpanded', false))

const Massnahmen = ({
  store,
  expanded,
  setExpanded,
  downloadFromView,
}: {
  store:Object,
  expanded: Boolean,
  setExpanded: () => void,
  downloadFromView: () => void,
}) => (
  <ApolloConsumer>
    {client =>
  <StyledCard>
    <StyledCardActions
      disableActionSpacing
      onClick={() => setExpanded(!expanded)}
    >
      <CardActionTitle>Massnahmen</CardActionTitle>
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
                const { data } = await client.query({
                  query: gql`
                    query view {
                      allVMassns {
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
                          id
                          jahr
                          datum
                          typ
                          beschreibung
                          bearbeiter
                          bemerkungen
                          planVorhanden
                          planBezeichnung
                          flaeche
                          form
                          pflanzanordnung
                          markierung
                          anzTriebe
                          anzPflanzen
                          anzPflanzstellen
                          wirtspflanze
                          herkunftPop
                          sammeldatum
                          changed
                          changedBy
                        }
                      }
                    }`
                })
                exportModule({data: get(data, 'allVMassns.nodes', []), store, fileName: 'Massnahmen'})
              }}
        >
          Massnahmen
        </DownloadCardButton>
        <DownloadCardButton
          onClick={() =>
            downloadFromView({
              view: 'v_massn_webgisbun',
              fileName: 'MassnahmenWebGisBun',
            })
          }
        >
          Massnahmen für WebGIS BUN
        </DownloadCardButton>
      </StyledCardContent>
    </Collapse>
  </StyledCard>
    }
  </ApolloConsumer>
)

export default enhance(Massnahmen)

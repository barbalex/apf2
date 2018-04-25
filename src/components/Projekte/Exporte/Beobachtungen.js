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

const enhance = compose(withState('expanded', 'setExpanded', false))

const Beobachtungen = ({
  expanded,
  setExpanded,
  downloadFromView,
}: {
  expanded: Boolean,
  setExpanded: () => void,
  downloadFromView: () => void,
}) => (
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
          onClick={() =>
            downloadFromView({
              view: 'v_beob',
              fileName: 'Beobachtungen',
            })
          }
        >
          <div>Alle Beobachtungen von Arten aus apflora.ch</div>
          <div>Nutzungsbedingungen der FNS beachten</div>
        </DownloadCardButton>
        <DownloadCardButton
          onClick={() =>
            downloadFromView({
              view: 'v_beob__mit_data',
              fileName: 'Beobachtungen',
            })
          }
        >
          <div>Alle Beobachtungen von Arten aus apflora.ch...</div>
          <div>...inklusive Original-Beobachtungsdaten (JSON)</div>
          <div>Dauert Minuten und umfasst hunderte Megabytes!</div>
          <div>Nutzungsbedingungen der FNS beachten</div>
        </DownloadCardButton>
      </StyledCardContent>
    </Collapse>
  </StyledCard>
)

export default enhance(Beobachtungen)

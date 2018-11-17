// @flow
import React, { useContext, useState } from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import compose from 'recompose/compose'
import styled from 'styled-components'
import get from 'lodash/get'
import app from 'ampersand-app'

import exportModule from '../../../../modules/export'
import Message from '../Message'
import withErrorState from '../../../../state/withErrorState'
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

const enhance = compose(withErrorState)

const Massnahmen = ({
  fileType,
  applyMapFilterToExport,
  errorState,
}: {
  fileType: String,
  applyMapFilterToExport: Boolean,
  errorState: Object,
}) => {
  const { mapFilter } = useContext(mobxStoreContext)
  const [expanded, setExpanded] = useState(false)
  const [message, setMessage] = useState(null)

  return (
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
              setMessage('Export "Massnahmen" wird vorbereitet...')
              try {
                const { data } = await app.client.query({
                  query: await import('./allVMassns').then(m => m.default),
                })
                exportModule({
                  data: get(data, 'allVMassns.nodes', []),
                  fileName: 'Massnahmen',
                  fileType,
                  applyMapFilterToExport,
                  mapFilter,
                  idKey: 'tpop_id',
                  xKey: 'tpop_x',
                  yKey: 'tpop_y',
                  errorState,
                })
              } catch (error) {
                errorState.add(error)
              }
              setMessage(null)
            }}
          >
            Massnahmen
          </DownloadCardButton>
          <DownloadCardButton
            onClick={async () => {
              setMessage('Export "MassnahmenWebGisBun" wird vorbereitet...')
              try {
                const { data } = await app.client.query({
                  query: await import('./allVMassnWebgisbuns').then(
                    m => m.default,
                  ),
                })
                exportModule({
                  data: get(data, 'allVMassnWebgisbuns.nodes', []),
                  fileName: 'MassnahmenWebGisBun',
                  fileType,
                  applyMapFilterToExport,
                  mapFilter,
                  idKey: 'TPOPGUID',
                  xKey: 'TPOP_X',
                  yKey: 'TPOP_Y',
                  errorState,
                })
              } catch (error) {
                errorState.add(error)
              }
              setMessage(null)
            }}
          >
            Massnahmen für WebGIS BUN
          </DownloadCardButton>
        </StyledCardContent>
      </Collapse>
      {!!message && <Message message={message} />}
    </StyledCard>
  )
}

export default enhance(Massnahmen)

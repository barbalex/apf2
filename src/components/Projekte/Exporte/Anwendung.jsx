import React, { useState, useCallback } from 'react'
import Collapse from '@mui/material/Collapse'
import Icon from '@mui/material/Icon'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import { observer } from 'mobx-react-lite'

import beziehungen from '../../../etc/beziehungen.png'
import {
  StyledCardContent,
  CardActionTitle,
  StyledCard,
  StyledCardActions,
  CardActionIconButton,
  DownloadCardButton,
} from './index'

const Anwendung = () => {
  const [expanded, setExpanded] = useState(false)

  const onClickAction = useCallback(() => setExpanded(!expanded), [expanded])
  const onClickGrafisch = useCallback(() => {
    window.open(beziehungen)
  }, [])

  return (
    <StyledCard>
      <StyledCardActions disableSpacing onClick={onClickAction}>
        <CardActionTitle>Anwendung</CardActionTitle>
        <CardActionIconButton
          data-expanded={expanded}
          aria-expanded={expanded}
          aria-label="öffnen"
          color="inherit"
        >
          <Icon title={expanded ? 'schliessen' : 'öffnen'}>
            <ExpandMoreIcon />
          </Icon>
        </CardActionIconButton>
      </StyledCardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {expanded ? (
          <StyledCardContent>
            <DownloadCardButton onClick={onClickGrafisch} color="inherit">
              Datenstruktur grafisch dargestellt
            </DownloadCardButton>
          </StyledCardContent>
        ) : null}
      </Collapse>
    </StyledCard>
  )
}

export default observer(Anwendung)

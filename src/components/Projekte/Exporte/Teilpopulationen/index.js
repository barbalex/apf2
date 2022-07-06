import React, { useState, useCallback } from 'react'
import Collapse from '@mui/material/Collapse'
import Icon from '@mui/material/Icon'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import CardContent from './CardContent'
import {
  CardActionTitle,
  StyledCard,
  StyledCardActions,
  CardActionIconButton,
} from '../index'

const Teilpopulationen = ({ treeName }) => {
  const [expanded, setExpanded] = useState(false)

  const onClickAction = useCallback(() => setExpanded(!expanded), [expanded])

  return (
    <StyledCard>
      <StyledCardActions disableSpacing onClick={onClickAction}>
        <CardActionTitle>Teilpopulationen</CardActionTitle>
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
        {expanded ? <CardContent treeName={treeName} /> : null}
      </Collapse>
    </StyledCard>
  )
}

export default Teilpopulationen

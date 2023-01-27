import React, { useState, useCallback } from 'react'
import Collapse from '@mui/material/Collapse'
import Icon from '@mui/material/Icon'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import {
  StyledCardContent,
  CardActionTitle,
  StyledCard,
  StyledCardActions,
  CardActionIconButton,
} from '../index'
import BeobNichtZuzuordnen from './BeobNichtZuzuordnen'
import BeobZugeordnet from './BeobZugeordnet'
import BeobArtChanged from './BeobArtChanged'

const BeobachtungenExports = () => {
  const [expanded, setExpanded] = useState(false)

  const onClickAction = useCallback(() => setExpanded(!expanded), [expanded])

  return (
    <StyledCard>
      <StyledCardActions disableSpacing onClick={onClickAction}>
        <CardActionTitle>Beobachtungen</CardActionTitle>
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
            <BeobArtChanged t />
            <BeobZugeordnet />
            <BeobNichtZuzuordnen />
          </StyledCardContent>
        ) : null}
      </Collapse>
    </StyledCard>
  )
}

export default BeobachtungenExports

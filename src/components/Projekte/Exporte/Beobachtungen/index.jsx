import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'

import {
  StyledCardContent,
  CardActionTitle,
  StyledCard,
  StyledCardActions,
  CardActionIconButton,
} from '../index.jsx'
import { BeobNichtZuzuordnen } from './BeobNichtZuzuordnen.jsx'
import { BeobZugeordnet } from './BeobZugeordnet.jsx'
import { BeobArtChanged } from './BeobArtChanged.jsx'

export const Beobachtungen = () => {
  const [expanded, setExpanded] = useState(false)

  const onClickAction = () => setExpanded(!expanded)

  return (
    <StyledCard>
      <StyledCardActions
        disableSpacing
        onClick={onClickAction}
      >
        <CardActionTitle>Beobachtungen</CardActionTitle>
        <Tooltip title={expanded ? 'schliessen' : 'öffnen'}>
          <CardActionIconButton
            data-expanded={expanded}
            aria-expanded={expanded}
            aria-label={expanded ? 'schliessen' : 'öffnen'}
            color="inherit"
          >
            <ExpandMoreIcon />
          </CardActionIconButton>
        </Tooltip>
      </StyledCardActions>
      <Collapse
        in={expanded}
        timeout="auto"
        unmountOnExit
      >
        {expanded ?
          <StyledCardContent>
            <BeobArtChanged t />
            <BeobZugeordnet />
            <BeobNichtZuzuordnen />
          </StyledCardContent>
        : null}
      </Collapse>
    </StyledCard>
  )
}

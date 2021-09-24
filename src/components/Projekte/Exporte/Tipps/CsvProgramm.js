import React, { useState } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import styled from 'styled-components'

import CsvInExcelOeffnen from './CsvInExcelOeffnen'

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
  transform: ${(props) => (props['data-expanded'] ? 'rotate(180deg)' : 'none')};
`
const CardActionTitle = styled.div`
  padding-left: 8px;
  font-weight: bold;
  word-break: break-word;
  user-select: none;
`
const StyledCardContent = styled(CardContent)`
  margin: -15px 0 0 0;
  ol {
    -webkit-padding-start: 16px;
  }
  li {
    margin-top: 4px;
  }
`

const CsvOeffnen = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <StyledCard>
      <StyledCardActions disableSpacing onClick={() => setExpanded(!expanded)}>
        <CardActionTitle>
          Welches Programm soll ich dazu verwenden?
        </CardActionTitle>
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
          {
            'Um die Datei das erste Mal zu öffnen eignet sich Libre Office am besten: '
          }
          <a
            href="https://de.libreoffice.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://de.libreoffice.org
          </a>
          <p>
            {
              'Microsoft Excel eignet sich sehr gut, um die Daten danach auswerten.'
            }
            <br />
            {
              'Speichern Sie die Datei daher in Libre Office als .xlsx-Datei ab und öffnen Sie sie danach mit Excel.'
            }
          </p>
          <CsvInExcelOeffnen />
        </StyledCardContent>
      </Collapse>
    </StyledCard>
  )
}

export default CsvOeffnen

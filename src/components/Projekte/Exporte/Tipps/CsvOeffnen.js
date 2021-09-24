import React, { useState } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
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
        <CardActionTitle>Wie öffne ich eine .csv-Datei?</CardActionTitle>
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
          Es gibt zwei Möglichkeiten:
          <ol>
            <li>
              {'Heruntergeladene Datei doppelklicken.'}
              <br />
              {'Meist wählt das Betriebssystem ein geeignetes Programm.'}
              <br />
              {
                'Dieses Programm erkennt hoffentlich, dass der Importassistent verwendet werden muss.'
              }
              <br />
              {'In Excel funktioniert dies häufig nicht!'}
            </li>
            <li>
              {
                'Gewünschtes Programm öffnen und damit die Datei öffnen (z.B. in Libre Office) oder die Daten importieren (z.B. in Excel).'
              }
              <br />
              {
                'Das Programm öffnet den Importassistenten, in dem man Feldtrenner, Texttrenner und Zeichensatz wählt. Und, ob die erste Zeile die Feldnamen enthält.'
              }
            </li>
          </ol>
        </StyledCardContent>
      </Collapse>
    </StyledCard>
  )
}

export default CsvOeffnen

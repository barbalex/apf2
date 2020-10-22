import React, { useState } from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
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

const WasIstCsv = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <StyledCard>
      <StyledCardActions disableSpacing onClick={() => setExpanded(!expanded)}>
        <CardActionTitle>Was ist eine .csv-Datei?</CardActionTitle>
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
          {'Eine reine Textdatei, deren Name mit ".csv" endet.'}
          <br />
          {'"csv" steht für: "comma separated values".'}
          <br />
          {'Die Datei hat folgende Eigenschaften:'}
          <ol>
            <li>
              {
                'Datenbank-Felder werden mit Kommas (,) getrennt ("Feldtrenner")'
              }
            </li>
            <li>
              {
                'Text in Feldern wird in Hochzeichen (") eingefasst ("Texttrenner")'
              }
            </li>
            <li>{'Die erste Zeile enthält die Feldnamen'}</li>
            <li>
              {'Der Zeichenstatz ist Unicode UTF-8'}
              <br />
              {
                'Ist ein falscher Zeichensatz gewählt, werden Sonderzeichen wie z.B. Umlaute falsch angezeigt.'
              }
            </li>
          </ol>
        </StyledCardContent>
      </Collapse>
    </StyledCard>
  )
}

export default WasIstCsv

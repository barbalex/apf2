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

const CsvInExcelOeffnen = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <StyledCard>
      <StyledCardActions disableSpacing onClick={() => setExpanded(!expanded)}>
        <CardActionTitle>
          Sie wollen die .csv-Datei direkt in Excel öffnen? Das wird nicht
          empfohlen, aber hier erfahren Sie, wie es funktionieren kann:
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
          <ol>
            <li>Excel öffnen</li>
            <li>{'"Daten" > "Externe Daten abrufen" > "Aus Text" wählen'}</li>
            <li>
              {'Nun erscheit der Textkonvertierungs-Assistent.'}
              <br />
              {
                'Im Schritt 1 als Dateiursprung statt dem vorgegebenen "Windows (ANSI)" dies hier wählen: "65001 : Unicode (UTF-8)". Excel versteht sonst partout keine Umlaute.'
              }
            </li>
            <li>
              {'Vorsicht: Excel vermanscht regelmässig importierte Daten!'}
              <br />
              {
                'Beim Importieren interpretiert es nämlich in jedem Feld die obersten paar Datensätze - und bestimmt einen Datentyp, ohne Sie zu fragen.'
              }
              <br />
              {
                'Auch wenn weiter unten in vielen Datensätzen die Daten bei der nun nötigen Umwandlung in diesen Datentyp in diesem Feld dadurch verändert oder gelöscht werden, weil sie nicht diesem Datentyp entsprechen.'
              }
              <br />
              {
                'Daher bitte Excel nur für die Auswertung von Daten benutzten - nicht um .csv-Dateien zu öffnen.'
              }
            </li>
          </ol>
        </StyledCardContent>
      </Collapse>
    </StyledCard>
  )
}

export default CsvInExcelOeffnen

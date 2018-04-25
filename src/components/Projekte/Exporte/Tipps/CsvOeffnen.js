// @flow
import React from 'react'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Collapse from 'material-ui/transitions/Collapse'
import IconButton from 'material-ui/IconButton'
import Icon from 'material-ui/Icon'
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
  ol {
    -webkit-padding-start: 16px;
  }
  li {
    margin-top: 4px;
  }
`

const enhance = compose(withState('expanded', 'setExpanded', false))

const CsvOeffnen = ({
  expanded,
  setExpanded,
}: {
  expanded: Boolean,
  setExpanded: () => void,
}) => (
  <StyledCard>
    <StyledCardActions
      disableActionSpacing
      onClick={() => setExpanded(!expanded)}
    >
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

export default enhance(CsvOeffnen)

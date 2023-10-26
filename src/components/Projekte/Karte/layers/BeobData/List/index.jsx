import { useCallback, useContext } from 'react'
import styled from '@emotion/styled'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../../../../../shared/ErrorBoundary'
import storeContext from '../../../../../../storeContext'
import List from './List'

const Container = styled.div`
  margin-left: -10px;
  margin-right: -10px;
`
const StyledAccordion = styled(Accordion)``
const StyledAccordionSummary = styled(AccordionSummary)`
  margin: 0;
  padding: 0 10px;
  min-height: 28px;
  > div {
    margin: 0;
  }
`
const StyledAccordionDetails = styled(AccordionDetails)`
  padding: 4px 8px;
`

const BeobData = ({ fields }) => {
  const store = useContext(storeContext)
  // saving in store so user does not have to repeatedly open/close
  const { setBeobDetailsOpen, beobDetailsOpen } = store.map
  const onClickDetails = useCallback(
    () => setBeobDetailsOpen(!beobDetailsOpen),
    [beobDetailsOpen, setBeobDetailsOpen],
  )

  return (
    <ErrorBoundary>
      <Container>
        <StyledAccordion
          expanded={beobDetailsOpen}
          onChange={onClickDetails}
          disableGutters
          elevation={1}
        >
          <StyledAccordionSummary>Daten</StyledAccordionSummary>
          <StyledAccordionDetails>
            <List fields={fields} />
          </StyledAccordionDetails>
        </StyledAccordion>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(BeobData)

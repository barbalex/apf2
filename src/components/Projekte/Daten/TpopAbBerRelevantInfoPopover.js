import React from 'react'
import styled from 'styled-components'

import ErrorBoundary from '../../shared/ErrorBoundary'

const LabelPopoverRow = styled.div`
  padding: 2px 5px 2px 5px;
`
const LabelPopoverTitleRow = styled(LabelPopoverRow)`
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background-color: #565656;
  color: white;
`
const LabelPopoverContentRow = styled(LabelPopoverRow)`
  display: flex;
  border-color: grey;
  border-width: thin;
  border-style: solid;
  border-top-style: none;
  &:last-child {
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
  }
`
const LabelPopoverRowColumnLeft = styled.div`
  width: 170px;
`
const LabelPopoverRowColumnRight = styled.div`
  padding-left: 5px;
`
const Container = styled.div`
  height: 100%;
`

export default (
  <ErrorBoundary>
    <Container>
      <LabelPopoverTitleRow>Legende</LabelPopoverTitleRow>
      <LabelPopoverContentRow>
        Möglichst immer ausfüllen, wenn die Teil-Population für den AP-Bericht
        nicht relevant ist.
      </LabelPopoverContentRow>
      <LabelPopoverContentRow>
        <LabelPopoverRowColumnLeft>
          nein (historisch):
        </LabelPopoverRowColumnLeft>
        <LabelPopoverRowColumnRight>
          erloschen, vor 1950 ohne Kontrolle
        </LabelPopoverRowColumnRight>
      </LabelPopoverContentRow>
      <LabelPopoverContentRow>
        <LabelPopoverRowColumnLeft>
          nein (kein Vorkommen):
        </LabelPopoverRowColumnLeft>
        <LabelPopoverRowColumnRight>
          {'siehe bei Populationen "überprüft, kein Vorkommen"'}
        </LabelPopoverRowColumnRight>
      </LabelPopoverContentRow>
    </Container>
  </ErrorBoundary>
)

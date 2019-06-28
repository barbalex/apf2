import React, { Fragment } from 'react'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'

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
  width: 110px;
`
const LabelPopoverRowColumnRight = styled.div`
  padding-left: 5px;
`

export default (
  <ErrorBoundary>
    <Fragment>
      <LabelPopoverTitleRow>Legende</LabelPopoverTitleRow>
      <LabelPopoverContentRow>
        Im 1. Jahr der Beobachtung die Entwicklung an der Massnahme beurteilen,
        nachher an vorhergehenden EK.
      </LabelPopoverContentRow>
      <LabelPopoverContentRow>
        <LabelPopoverRowColumnLeft>{'zunehmend:'}</LabelPopoverRowColumnLeft>
        <LabelPopoverRowColumnRight>
          {'> 10% Zunahme'}
        </LabelPopoverRowColumnRight>
      </LabelPopoverContentRow>
      <LabelPopoverContentRow>
        <LabelPopoverRowColumnLeft>stabil:</LabelPopoverRowColumnLeft>
        <LabelPopoverRowColumnRight>{'± 10%'}</LabelPopoverRowColumnRight>
      </LabelPopoverContentRow>
      <LabelPopoverContentRow>
        <LabelPopoverRowColumnLeft>abnehmend:</LabelPopoverRowColumnLeft>
        <LabelPopoverRowColumnRight>
          {'> 10% Abnahme'}
        </LabelPopoverRowColumnRight>
      </LabelPopoverContentRow>
      <LabelPopoverContentRow>
        <LabelPopoverRowColumnLeft>
          erloschen / nicht etabliert:
        </LabelPopoverRowColumnLeft>
        <LabelPopoverRowColumnRight>
          {
            'nach 2 aufeinander folgenden Kontrollen ohne Funde oder nach Einschätzung AP-VerantwortlicheR'
          }
        </LabelPopoverRowColumnRight>
      </LabelPopoverContentRow>
      <LabelPopoverContentRow>
        <LabelPopoverRowColumnLeft>unsicher:</LabelPopoverRowColumnLeft>
        <LabelPopoverRowColumnRight>
          {
            'keine Funde aber noch nicht erloschen (nach zwei Kontrollen ohne Funde kann Status erloschen/nicht etabliert gewählt werden)'
          }
        </LabelPopoverRowColumnRight>
      </LabelPopoverContentRow>
    </Fragment>
  </ErrorBoundary>
)

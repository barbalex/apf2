import React, { useState } from 'react'
import styled from 'styled-components'
import SimpleBar from 'simplebar-react'

import FormTitle from '../../shared/FormTitle'
import Tipps from './Tipps'
import Ap from './Ap'
import Populationen from './Populationen'
import Teilpopulationen from './Teilpopulationen'
import Kontrollen from './Kontrollen'
import Massnahmen from './Massnahmen'
import Beobachtungen from './Beobachtungen'
import Anwendung from './Anwendung'
import Optionen from './Optionen'
import ErrorBoundary from '../../shared/ErrorBoundary'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  @media print {
    display: none !important;
  }
`
const ScrollContainer = styled.div`
  height: ${(props) => `calc(100% - ${props['data-form-title-height']}px)`};
`
const InnerContainer = styled.div`
  padding: 10px;
`
const ExporteContainer = styled.div`
  height: 100%;
`

const Exporte = () => {
  const [formTitleHeight, setFormTitleHeight] = useState(0)

  return (
    <ExporteContainer data-id={`exporte-container`}>
      <ErrorBoundary>
        <Container>
          <FormTitle
            title="Exporte"
            treeName="tree"
            setFormTitleHeight={setFormTitleHeight}
          />
          <ScrollContainer data-form-title-height={formTitleHeight}>
            <SimpleBar
              style={{
                maxHeight: '100%',
                height: '100%',
              }}
            >
              <InnerContainer>
                <Optionen />
                <Tipps />
                <Ap />
                <Populationen />
                <Teilpopulationen />
                <Kontrollen />
                <Massnahmen />
                <Beobachtungen />
                <Anwendung />
              </InnerContainer>
            </SimpleBar>
          </ScrollContainer>
        </Container>
      </ErrorBoundary>
    </ExporteContainer>
  )
}

export default Exporte

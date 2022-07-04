import React, { useState } from 'react'
import styled from 'styled-components'

import ApFilter from '../Daten/ApFilter'
import PopFilter from '../Daten/PopFilter'
import TpopFilter from '../Daten/TpopFilter'
import TpopmassnFilter from '../Daten/TpopmassnFilter'
import TpopfeldkontrFilter from '../Daten/TpopfeldkontrFilter'
import TpopfreiwkontrFilter from '../Daten/TpopfreiwkontrFilter'
import ErrorBoundary from '../../shared/ErrorBoundary'
import Title from './Title'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #ffd3a7;
`

const Filter = ({ treeName }) => {
  const [activeTab, setActiveTab] = useState('ap')

  return (
    <ErrorBoundary>
      <Container>
        <Title activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'ap' && <ApFilter treeName={treeName} />}
        {activeTab === 'pop' && <PopFilter treeName={treeName} />}
        {activeTab === 'tpop' && <TpopFilter treeName={treeName} />}
        {activeTab === 'tpopmassn' && <TpopmassnFilter treeName={treeName} />}
        {activeTab === 'tpopfeldkontr' && (
          <TpopfeldkontrFilter treeName={treeName} />
        )}
        {activeTab === 'tpopfreiwkontr' && (
          <TpopfreiwkontrFilter treeName={treeName} />
        )}
      </Container>
    </ErrorBoundary>
  )
}

export default Filter

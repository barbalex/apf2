import React, { useState } from 'react'
import styled from 'styled-components'

import ApFilter from '../Daten/ApFilter'
import PopFilter from '../Daten/PopFilter'
import TpopFilter from '../Daten/TpopFilter'
import TpopmassnFilter from '../Daten/TpopmassnFilter'
import TpopfeldkontrFilter from '../Daten/TpopfeldkontrFilter'
import Tpopfreiwkontr from '../Daten/Tpopfreiwkontr'
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
          <TpopfeldkontrFilter treeName={treeName} showFilter={true} />
        )}
        {activeTab === 'tpopfreiwkontr' && (
          <Tpopfreiwkontr treeName={treeName} showFilter={true} />
        )}
      </Container>
    </ErrorBoundary>
  )
}

export default Filter

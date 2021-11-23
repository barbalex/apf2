import React, { useState } from 'react'
import styled from 'styled-components'

import ApFilter from '../Daten/ApFilter'
import PopFilter from '../Daten/PopFilter'
import Tpop from '../Daten/Tpop'
import TpopmassnFilter from '../Daten/TpopmassnFilter'
import Tpopfeldkontr from '../Daten/Tpopfeldkontr'
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
  const [titleHeight, setTitleHeight] = useState(81)

  return (
    <ErrorBoundary>
      <Container>
        <Title
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setTitleHeight={setTitleHeight}
        />
        {activeTab === 'ap' && (
          <ApFilter treeName={treeName} filterTitleHeight={titleHeight} />
        )}
        {activeTab === 'pop' && (
          <PopFilter treeName={treeName} filterTitleHeight={titleHeight} />
        )}
        {activeTab === 'tpop' && (
          <Tpop
            treeName={treeName}
            filterTitleHeight={titleHeight}
            showFilter={true}
          />
        )}
        {activeTab === 'tpopmassn' && (
          <TpopmassnFilter
            treeName={treeName}
            filterTitleHeight={titleHeight}
          />
        )}
        {activeTab === 'tpopfeldkontr' && (
          <Tpopfeldkontr
            treeName={treeName}
            filterTitleHeight={titleHeight}
            showFilter={true}
          />
        )}
        {activeTab === 'tpopfreiwkontr' && (
          <Tpopfreiwkontr
            treeName={treeName}
            filterTitleHeight={titleHeight}
            showFilter={true}
          />
        )}
      </Container>
    </ErrorBoundary>
  )
}

export default Filter

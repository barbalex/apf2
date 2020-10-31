import React, { useState, useContext } from 'react'
import styled from 'styled-components'

import ApFilter from '../Daten/ApFilter'
import PopFilter from '../Daten/PopFilter'
import Tpop from '../Daten/Tpop'
import TpopmassnFilter from '../Daten/TpopmassnFilter'
import Tpopfeldkontr from '../Daten/Tpopfeldkontr'
import Tpopfreiwkontr from '../Daten/Tpopfreiwkontr'
import ErrorBoundary from '../../shared/ErrorBoundary'
import storeContext from '../../../storeContext'
import Title from './Title'

const Container = styled.div`
  height: ${(props) => `calc(100vh - ${props['data-appbar-height']}px)`};
  display: flex;
  flex-direction: column;
  background-color: #ffd3a7;
`

const Filter = ({ treeName }) => {
  const store = useContext(storeContext)
  const { appBarHeight } = store

  const [activeTab, setActiveTab] = useState('ap')
  const [titleHeight, setTitleHeight] = useState(81)

  return (
    <ErrorBoundary>
      <Container data-appbar-height={appBarHeight}>
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

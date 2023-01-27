import styled from '@emotion/styled'

import ApFilter from '../Daten/ApFilter'
import PopFilter from '../Daten/PopFilter'
import TpopFilter from '../Daten/TpopFilter'
import TpopmassnFilter from '../Daten/TpopmassnFilter'
import TpopfeldkontrFilter from '../Daten/TpopfeldkontrFilter'
import TpopfreiwkontrFilter from '../Daten/TpopfreiwkontrFilter'
import ErrorBoundary from '../../shared/ErrorBoundary'
import Title from './Title'
import useSearchParamsState from '../../../modules/useSearchParamsState'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #ffd3a7;
`

const Filter = () => {
  const [tab, setTab] = useSearchParamsState('filterTab', 'ap')

  return (
    <ErrorBoundary>
      <Container>
        <Title activeTab={tab} setActiveTab={setTab} />
        {tab === 'ap' && <ApFilter />}
        {tab === 'pop' && <PopFilter />}
        {tab === 'tpop' && <TpopFilter />}
        {tab === 'tpopmassn' && <TpopmassnFilter />}
        {tab === 'tpopfeldkontr' && <TpopfeldkontrFilter />}
        {tab === 'tpopfreiwkontr' && <TpopfreiwkontrFilter />}
      </Container>
    </ErrorBoundary>
  )
}

export default Filter

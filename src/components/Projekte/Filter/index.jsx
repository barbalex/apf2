import styled from '@emotion/styled'

import ApFilter from '../Daten/ApFilter/index.jsx'
import PopFilter from '../Daten/PopFilter/index.jsx'
import { TpopFilter } from '../Daten/TpopFilter/index.tsx'
import TpopmassnFilter from '../Daten/TpopmassnFilter/index.jsx'
import TpopfeldkontrFilter from '../Daten/TpopfeldkontrFilter/index.jsx'
import TpopfreiwkontrFilter from '../Daten/TpopfreiwkontrFilter/index.jsx'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'
import Title from './Title.jsx'
import { useSearchParamsState } from '../../../modules/useSearchParamsState.js'

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

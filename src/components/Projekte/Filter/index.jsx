import { ApFilter } from '../Daten/ApFilter/index.jsx'
import { PopFilter } from '../Daten/PopFilter/index.jsx'
import { TpopFilter } from '../Daten/TpopFilter/index.tsx'
import { TpopmassnFilter } from '../Daten/TpopmassnFilter/index.jsx'
import { TpopfeldkontrFilter } from '../Daten/TpopfeldkontrFilter/index.jsx'
import { TpopfreiwkontrFilter } from '../Daten/TpopfreiwkontrFilter/index.jsx'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'
import { Title } from './Title.jsx'
import { useSearchParamsState } from '../../../modules/useSearchParamsState.js'

import { container } from './index.module.css'

export const Filter = () => {
  const [tab, setTab] = useSearchParamsState('filterTab', 'ap')

  return (
    <ErrorBoundary>
      <div className={container}>
        <Title
          activeTab={tab}
          setActiveTab={setTab}
        />
        {tab === 'ap' && <ApFilter />}
        {tab === 'pop' && <PopFilter />}
        {tab === 'tpop' && <TpopFilter />}
        {tab === 'tpopmassn' && <TpopmassnFilter />}
        {tab === 'tpopfeldkontr' && <TpopfeldkontrFilter />}
        {tab === 'tpopfreiwkontr' && <TpopfreiwkontrFilter />}
      </div>
    </ErrorBoundary>
  )
}

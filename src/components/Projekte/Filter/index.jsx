import { ApFilter } from '../Daten/ApFilter/index.tsx'
import { PopFilter } from '../Daten/PopFilter/index.tsx'
import { TpopFilter } from '../Daten/TpopFilter/index.tsx'
import { TpopmassnFilter } from '../Daten/TpopmassnFilter/index.tsx'
import { TpopfeldkontrFilter } from '../Daten/TpopfeldkontrFilter/index.tsx'
import { TpopfreiwkontrFilter } from '../Daten/TpopfreiwkontrFilter/index.tsx'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'
import { Title } from './Title.jsx'
import { useSearchParamsState } from '../../../modules/useSearchParamsState.js'

import styles from './index.module.css'

export const Filter = () => {
  const [tab, setTab] = useSearchParamsState('filterTab', 'ap')

  return (
    <ErrorBoundary>
      <div className={styles.container}>
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

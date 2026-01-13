import { ApFilter } from '../Daten/ApFilter/index.js'
import { PopFilter } from '../Daten/PopFilter/index.js'
import { TpopFilter } from '../Daten/TpopFilter/index.js'
import { TpopmassnFilter } from '../Daten/TpopmassnFilter/index.js'
import { TpopfeldkontrFilter } from '../Daten/TpopfeldkontrFilter/index.js'
import { TpopfreiwkontrFilter } from '../Daten/TpopfreiwkontrFilter/index.js'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'
import { Title } from './Title.js'
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

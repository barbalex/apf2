import { ApFilter } from '../Daten/ApFilter/index.tsx'
import { PopFilter } from '../Daten/PopFilter/index.tsx'
import { TpopFilter } from '../Daten/TpopFilter/index.tsx'
import { TpopmassnFilter } from '../Daten/TpopmassnFilter/index.tsx'
import { TpopfeldkontrFilter } from '../Daten/TpopfeldkontrFilter/index.tsx'
import { TpopfreiwkontrFilter } from '../Daten/TpopfreiwkontrFilter/index.tsx'
import { ErrorBoundary } from '../../shared/ErrorBoundary.tsx'
import { Title } from './Title.tsx'
import { useSearchParamsState } from '../../../modules/useSearchParamsState.ts'

import styles from './index.module.css'

// keep in sync with TabValue in ./Title.tsx
type FilterTab =
  | 'ap'
  | 'pop'
  | 'tpop'
  | 'tpopmassn'
  | 'tpopfeldkontr'
  | 'tpopfreiwkontr'

export const Filter = () => {
  const [tab, setTab] = useSearchParamsState<FilterTab>('filterTab', 'ap')

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

import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client/react'

import { Select } from '../../../../../shared/Select.tsx'
import { MobxContext } from '../../../../../../mobxContext.js'
import { query } from './query.ts'
import { Error } from '../../../../../shared/Error.tsx'

import type { AdresseId } from '../../../../../../models/apflora/AdresseId.ts'

import styles from '../../../Tpopfreiwkontr/Form/Headdata/index.module.css'

interface TpopfreiwkontrAdressesFilterQueryResult {
  allAdresses: {
    nodes: Array<{
      value: AdresseId
      label: string
    }>
  }
}

interface HeaddataProps {
  row: any
  activeTab: number
}

export const Headdata = observer(({ row, activeTab }: HeaddataProps) => {
  const store = useContext(MobxContext)
  const { dataFilterSetValue } = store.tree
  const { data, loading, error } =
    useQuery<TpopfreiwkontrAdressesFilterQueryResult>(query)

  const saveToDb = (event: React.ChangeEvent<HTMLInputElement>) =>
    dataFilterSetValue({
      table: 'tpopfreiwkontr',
      key: 'bearbeiter',
      value: event.target.value,
      index: activeTab,
    })

  if (error) return <Error error={error} />

  return (
    <div className={styles.container}>
      <div className={styles.bearbLabel}>BeobachterIn</div>
      <div className={styles.bearbVal}>
        <Select
          key={`${row?.id}${activeTab}bearbeiter`}
          name="bearbeiter"
          value={row?.bearbeiter}
          field="bearbeiter"
          options={data?.allAdresses?.nodes ?? []}
          loading={loading}
          saveToDb={saveToDb}
        />
      </div>
    </div>
  )
})

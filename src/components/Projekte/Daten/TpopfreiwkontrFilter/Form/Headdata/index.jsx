import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client/react'

import { Select } from '../../../../../shared/Select.jsx'
import { MobxContext } from '../../../../../../mobxContext.js'
import { query } from './query.js'
import { Error } from '../../../../../shared/Error.jsx'

import styles from '../../../Tpopfreiwkontr/Form/Headdata/index.module.css'

export const Headdata = observer(({ row, activeTab }) => {
  const store = useContext(MobxContext)
  const { dataFilterSetValue } = store.tree
  const { data, loading, error } = useQuery(query)

  const saveToDb = (event) =>
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

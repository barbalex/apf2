import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Headdata } from './Headdata/index.jsx'
import { DateField as Date } from '../../Tpopfreiwkontr/Form/Date.jsx'
import { Map } from '../../Tpopfreiwkontr/Form/Map.jsx'
import { Cover } from '../../Tpopfreiwkontr/Form/Cover.jsx'
import { More } from '../../Tpopfreiwkontr/Form/More.jsx'
import { Danger } from '../../Tpopfreiwkontr/Form/Danger.jsx'
import { Remarks } from '../../Tpopfreiwkontr/Form/Remarks.jsx'
import { EkfRemarks } from '../../Tpopfreiwkontr/Form/EkfRemarks.jsx'
import { Verification } from '../../Tpopfreiwkontr/Form/Verification.jsx'
import { MobxContext } from '../../../../../mobxContext.js'
import { ifIsNumericAsNumber } from '../../../../../modules/ifIsNumericAsNumber.js'

import styles from '../../Tpopfreiwkontr/Form/index.module.css'

export const Form = observer(({ row, activeTab }) => {
  const store = useContext(MobxContext)
  const { dataFilterSetValue } = store.tree

  const saveToDb = (event) =>
    dataFilterSetValue({
      table: 'tpopfreiwkontr',
      key: event.target.name,
      value: ifIsNumericAsNumber(event.target.value),
      index: activeTab,
    })

  return (
    <div className={styles.formContainer}>
      <div className={styles.gridContainer}>
        <Headdata
          row={row}
          activeTab={activeTab}
        />
        <Date
          saveToDb={saveToDb}
          row={row}
        />
        <Map
          key={`map${row?.planVorhanden}`}
          saveToDb={saveToDb}
          row={row}
        />
        <Cover
          saveToDb={saveToDb}
          row={row}
        />
        <More
          key={`more${row?.jungpflanzenVorhanden}`}
          saveToDb={saveToDb}
          row={row}
        />
        <Danger
          saveToDb={saveToDb}
          row={row}
        />
        <Remarks
          saveToDb={saveToDb}
          row={row}
        />
        <EkfRemarks
          saveToDb={saveToDb}
          row={row}
        />
        <Verification
          key={`verification${row?.apberNichtRelevant}`}
          saveToDb={saveToDb}
          row={row}
        />
      </div>
      <div style={{ height: '64px' }} />
    </div>
  )
})

import { type ChangeEvent } from 'react'
import { useSetAtom } from 'jotai'

import { Headdata } from './Headdata/index.tsx'
import { DateField as Date } from '../../Tpopfreiwkontr/Form/Date.tsx'
import { Map } from '../../Tpopfreiwkontr/Form/Map.tsx'
import { Cover } from '../../Tpopfreiwkontr/Form/Cover.tsx'
import { More } from '../../Tpopfreiwkontr/Form/More.tsx'
import { Danger } from '../../Tpopfreiwkontr/Form/Danger.tsx'
import { Remarks } from '../../Tpopfreiwkontr/Form/Remarks.tsx'
import { EkfRemarks } from '../../Tpopfreiwkontr/Form/EkfRemarks.tsx'
import { Verification } from '../../Tpopfreiwkontr/Form/Verification.tsx'
import { treeDataFilterSetValueAtom } from '../../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../../modules/ifIsNumericAsNumber.ts'

import styles from '../../Tpopfreiwkontr/Form/index.module.css'

interface FormProps {
  row: any
  activeTab: number
}

export const Form = ({ row, activeTab }: FormProps) => {
  const setDataFilterValue = useSetAtom(treeDataFilterSetValueAtom)

  const saveToDb = (event: ChangeEvent<HTMLInputElement>) =>
    setDataFilterValue({
      table: 'tpopfreiwkontr',
      key: event.target.name,
      value: ifIsNumericAsNumber(event.target.value),
      index: activeTab,
    })

  return (
    <div className={styles.formContainer}>
      <div className={styles.gridContainer}>
        <Headdata row={row} activeTab={activeTab} />
        <Date saveToDb={saveToDb} row={row} />
        <Map key={`map${row?.planVorhanden}`} saveToDb={saveToDb} row={row} />
        <Cover saveToDb={saveToDb} row={row} />
        <More
          key={`more${row?.jungpflanzenVorhanden}`}
          saveToDb={saveToDb}
          row={row}
        />
        <Danger saveToDb={saveToDb} row={row} />
        <Remarks saveToDb={saveToDb} row={row} />
        <EkfRemarks saveToDb={saveToDb} row={row} />
        <Verification
          key={`verification${row?.apberNichtRelevant}`}
          saveToDb={saveToDb}
          row={row}
        />
      </div>
      <div style={{ height: '64px' }} />
    </div>
  )
}

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

import type {
  TpopkontrRow,
  TpopkontrSaveToDbEvent,
} from '../../Tpopfreiwkontr/Form/index.tsx'
import type { AdresseId } from '../../../../../models/apflora/Adresse.ts'

import styles from '../../Tpopfreiwkontr/Form/index.module.css'

export interface TpopfreiwkontrFilterRow {
  id?: string
  bearbeiter?: AdresseId | null
  planVorhanden?: boolean | null
  jungpflanzenVorhanden?: boolean | null
  apberNichtRelevant?: boolean | null
}

interface FormProps {
  row: TpopfreiwkontrFilterRow | undefined
  activeTab: number
}

export const Form = ({ row, activeTab }: FormProps) => {
  const setDataFilterValue = useSetAtom(treeDataFilterSetValueAtom)

  const saveToDb = (event: TpopkontrSaveToDbEvent) =>
    setDataFilterValue({
      table: 'tpopfreiwkontr',
      key: event.target.name,
      value: ifIsNumericAsNumber(event.target.value),
      index: activeTab,
    })

  // the reused Tpopfreiwkontr form fields expect the tpopkontr row shape
  const formRow = row as Partial<TpopkontrRow>

  return (
    <div className={styles.formContainer}>
      <div className={styles.gridContainer}>
        <Headdata row={row} activeTab={activeTab} />
        <Date saveToDb={saveToDb} row={formRow} errors={{}} />
        <Map
          key={`map${row?.planVorhanden}`}
          saveToDb={saveToDb}
          row={formRow}
          errors={{}}
        />
        <Cover saveToDb={saveToDb} row={formRow} errors={{}} />
        <More
          key={`more${row?.jungpflanzenVorhanden}`}
          saveToDb={saveToDb}
          row={formRow}
          errors={{}}
        />
        <Danger saveToDb={saveToDb} row={formRow} errors={{}} />
        <Remarks saveToDb={saveToDb} row={formRow} errors={{}} />
        <EkfRemarks saveToDb={saveToDb} row={formRow} errors={{}} />
        <Verification
          key={`verification${row?.apberNichtRelevant}`}
          saveToDb={saveToDb}
          row={formRow}
          errors={{}}
        />
      </div>
      <div style={{ height: '64px' }} />
    </div>
  )
}

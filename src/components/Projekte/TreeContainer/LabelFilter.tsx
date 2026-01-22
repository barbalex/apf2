import { useContext, useState, useEffect } from 'react'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import { MdDeleteSweep } from 'react-icons/md'
import { snakeCase } from 'es-toolkit'
import { observer } from 'mobx-react-lite'
import { useAtomValue, useSetAtom } from 'jotai'

import { tables } from '../../../modules/tables.ts'
import { MobxContext } from '../../../mobxContext.ts'
import {
  treeNodeLabelFilterAtom,
  treeSetNodeLabelFilterKeyAtom,
  treeEmptyNodeLabelFilterAtom,
} from '../../../JotaiStore/index.ts'

import styles from './LabelFilter.module.css'

const getValues = ({ activeFilterTable, nodeLabelFilter }) => {
  let labelText = '(filtern nicht möglich)'
  let filterValue = ''

  if (activeFilterTable) {
    filterValue = nodeLabelFilter?.[activeFilterTable] ?? ''
    // make sure 0 is kept
    if (!filterValue && filterValue !== 0) filterValue = ''
    // should be to_under_score_case
    const table = tables.find((t) => t.table === snakeCase(activeFilterTable))
    const tableLabel = table ? table.label : null
    // danger: Projekte can not be filtered because no parent folder
    if (tableLabel !== 'Projekte') {
      labelText = `${tableLabel} filtern`
    }
  }

  return { labelText, filterValue }
}

export const LabelFilter = observer(() => {
  const store = useContext(MobxContext)
  const { activeFilterTable } = store.tree
  const nodeLabelFilter = useAtomValue(treeNodeLabelFilterAtom)
  const setNodeLabelFilterKey = useSetAtom(treeSetNodeLabelFilterKeyAtom)
  const empty = useSetAtom(treeEmptyNodeLabelFilterAtom)
  const isFiltered = Object.values(nodeLabelFilter).some(
    (v) => v !== null && v !== '',
  )

  const { labelText, filterValue } = getValues({
    activeFilterTable,
    nodeLabelFilter,
  })

  const [value, setValue] = useState(filterValue)
  // value should update when changed from outside
  useEffect(() => {
    if (filterValue === value) return
    setValue(filterValue)
  }, [filterValue])

  const setNodeLabelFilter = (val) =>
    setNodeLabelFilterKey({
      value: val,
      key: activeFilterTable,
    })

  const onChange = (e) => {
    if (labelText === '(filtern nicht möglich)') return

    // remove some values as they can cause exceptions in regular expressions
    const val = e.target.value.replaceAll('(', '').replaceAll(')', '')
    setValue(val)
  }

  const onKeyUp = (e) => e.key === 'Enter' && setNodeLabelFilter(value)

  const onClickEmptyFilter = () => {
    empty()
    setValue('')
  }

  return (
    <FormControl
      fullWidth
      variant="standard"
      className={styles.formControl}
    >
      <InputLabel htmlFor={labelText}>{labelText}</InputLabel>
      <Input
        id={labelText}
        value={value}
        onChange={onChange}
        onKeyUp={onKeyUp}
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        endAdornment={
          isFiltered || value?.length ?
            <InputAdornment
              position="end"
              onClick={onClickEmptyFilter}
              title="Alle Filter entfernen"
            >
              <MdDeleteSweep className={styles.deleteFilterIcon} />
            </InputAdornment>
          : null
        }
        className={styles.input}
      />
    </FormControl>
  )
})

import { useState } from 'react'
import type { ChangeEvent, KeyboardEvent } from 'react'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import { MdDeleteSweep } from 'react-icons/md'
import { useAtomValue, useSetAtom } from 'jotai'

import { tables } from '../../../modules/tables.ts'
import {
  treeNodeLabelFilterAtom,
  treeActiveFilterTableAtom,
  treeSetNodeLabelFilterKeyAtom,
  treeEmptyNodeLabelFilterAtom,
  type TreeNodeLabelFilter,
} from '../../../store/index.ts'

import styles from './LabelFilter.module.css'

const getValues = ({
  activeFilterTable,
  nodeLabelFilter,
}: {
  activeFilterTable: string | undefined
  nodeLabelFilter: TreeNodeLabelFilter
}) => {
  let labelText = '(filtern nicht möglich)'
  let filterValue = ''

  if (activeFilterTable) {
    filterValue = nodeLabelFilter?.[activeFilterTable] ?? ''
    // make sure 0 is kept
    if (!filterValue) filterValue = ''
    // activeFilterTable is already in snake_case format, no conversion needed. Was: snakeCase
    const table = tables.find((t) => t.table === activeFilterTable)
    const tableLabel = table ? table.label : null
    // danger: Projekte can not be filtered because no parent folder
    if (tableLabel !== 'Projekte') {
      labelText = `${tableLabel} filtern`
    }
  }

  return { labelText, filterValue }
}

export const LabelFilter = () => {
  const activeFilterTable = useAtomValue(treeActiveFilterTableAtom)
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
  const [prevFilterValue, setPrevFilterValue] = useState(filterValue)
  // value should update when changed from outside
  if (prevFilterValue !== filterValue) {
    setPrevFilterValue(filterValue)
    setValue(filterValue)
  }

  const setNodeLabelFilter = (val: string) => {
    if (!activeFilterTable) return
    setNodeLabelFilterKey({
      value: val,
      key: activeFilterTable,
    })
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (labelText === '(filtern nicht möglich)') return

    // remove some values as they can cause exceptions in regular expressions
    const val = e.target.value.replaceAll('(', '').replaceAll(')', '')
    setValue(val)
  }

  const onKeyUp = (e: KeyboardEvent<HTMLInputElement>) =>
    e.key === 'Enter' && setNodeLabelFilter(value)

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
}

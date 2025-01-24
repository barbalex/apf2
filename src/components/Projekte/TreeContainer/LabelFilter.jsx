import {
  memo,
  useCallback,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import { MdDeleteSweep } from 'react-icons/md'
import styled from '@emotion/styled'
import snakeCase from 'lodash/snakeCase'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'

import { tables } from '../../../modules/tables.js'
import { MobxContext } from '../../../mobxContext.js'

const StyledFormControl = styled(FormControl)`
  padding-right: 0.8em !important;
`
const StyledInput = styled(Input)`
  div hr {
    width: calc(100% - 20px) !important;
  }
  &:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`
const StyledDeleteFilterIcon = styled(MdDeleteSweep)`
  cursor: pointer;
  pointer-events: auto;
  padding-top: 5px;
  color: rgba(0, 0, 0, 0.7);
  font-size: 1.5rem;
`

export const LabelFilter = memo(
  observer(() => {
    const store = useContext(MobxContext)
    const { nodeLabelFilter: nodeLabelFilterRaw, activeFilterTable } =
      store.tree
    const nodeLabelFilter = getSnapshot(nodeLabelFilterRaw)
    const setNodeLabelFilterKey = store.tree.nodeLabelFilter.setKey
    const empty = store.tree.nodeLabelFilter.empty
    const isFiltered = store.tree.nodeLabelFilter.isFiltered()

    const { labelText, filterValue } = useMemo(() => {
      let labelText = '(filtern nicht möglich)'
      let filterValue = ''

      if (activeFilterTable) {
        filterValue = nodeLabelFilter?.[activeFilterTable] ?? ''
        // make sure 0 is kept
        if (!filterValue && filterValue !== 0) filterValue = ''
        // should be to_under_score_case
        const table = tables.find(
          (t) => t.table === snakeCase(activeFilterTable),
        )
        const tableLabel = table ? table.label : null
        // danger: Projekte can not be filtered because no parent folder
        if (tableLabel !== 'Projekte') {
          labelText = `${tableLabel} filtern`
        }
      }

      return { labelText, filterValue }
    }, [activeFilterTable, nodeLabelFilter])

    const [value, setValue] = useState(filterValue)
    // value should update when changed from outside
    useEffect(() => {
      if (filterValue === value) return
      setValue(filterValue)
    }, [filterValue])

    const setNodeLabelFilter = useCallback(
      (val) =>
        setNodeLabelFilterKey({
          value: val,
          key: activeFilterTable,
        }),
      [setNodeLabelFilterKey, activeFilterTable],
    )

    const onChange = useCallback(
      (e) => {
        if (labelText === '(filtern nicht möglich)') return

        // remove some values as they can cause exceptions in regular expressions
        const val = e.target.value.replaceAll('(', '').replaceAll(')', '')
        setValue(val)
      },
      [labelText],
    )

    const onKeyUp = useCallback(
      (e) => {
        if (e.key === 'Enter') setNodeLabelFilter(value)
      },
      [setNodeLabelFilter, value],
    )

    const onClickEmptyFilter = useCallback(() => {
      empty()
      setValue('')
    }, [empty])

    return (
      <StyledFormControl
        fullWidth
        variant="standard"
      >
        <InputLabel htmlFor={labelText}>{labelText}</InputLabel>
        <StyledInput
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
                <StyledDeleteFilterIcon />
              </InputAdornment>
            : null
          }
        />
      </StyledFormControl>
    )
  }),
)
